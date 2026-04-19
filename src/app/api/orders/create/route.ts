import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { client } from "@/sanity/lib/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: Request) {
  const ip = (await headers()).get("x-forwarded-for") ?? "unknown";
  if (!rateLimit(ip, 10, 60_000)) {
    return new NextResponse("Demasiadas solicitudes. Intenta más tarde.", { status: 429 });
  }
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { formData, paymentMethod, cartItems, cartTotal, shippingFee, orderTotal, userEmailForContext } = body;

    const emailToUse = session?.user?.email || userEmailForContext;

    if (!emailToUse) {
      return new NextResponse("No Autorizado", { status: 401 });
    }

    // Obtener el ID del usuario en Sanity a través de su correo
    const userQuery = `*[_type == "user" && email == $email][0]._id`;
    const userId = await client.fetch(userQuery, { email: emailToUse });

    if (!userId) {
      return new NextResponse("Usuario no encontrado en la base de datos.", { status: 404 });
    }

    // Validate prices server-side to prevent client-side manipulation
    const productIds = cartItems.map((item: any) => item.id);
    const priceQuery = `*[_type == "product" && _id in $ids] { _id, price, discountedPrice }`;
    const serverProducts: { _id: string; price: number; discountedPrice?: number }[] = await client.fetch(priceQuery, { ids: productIds });

    const priceMap = new Map(serverProducts.map((p) => [p._id, p.discountedPrice ?? p.price]));

    for (const item of cartItems as any[]) {
      const serverPrice = priceMap.get(item.id);
      if (serverPrice === undefined) {
        return new NextResponse(`Producto no encontrado: ${item.id}`, { status: 400 });
      }
      if (Math.abs(serverPrice - item.price) > 0.01) {
        return new NextResponse(`Precio inválido para producto: ${item.id}`, { status: 400 });
      }
    }

    // Formatear los line items
    const formattedItems = (cartItems as any[]).map((item: any) => ({
      _key: crypto.randomUUID(),
      product: {
        _type: "reference",
        _ref: item.id,
      },
      quantity: item.quantity,
      priceAtPurchase: priceMap.get(item.id) as number,
    }));

    // Generar número de orden (EJ: ORD-1701234567)
    const orderNumber = `ORD-${Date.now()}`;

    // Crear el documento de la orden en Sanity
    const writeClient = client.withConfig({
      token: process.env.SANITY_API_TOKEN,
    });

    const newOrder = await writeClient.create({
      _type: "order",
      orderNumber,
      user: {
        _type: "reference",
        _ref: userId,
      },
      items: formattedItems,
      totalAmount: orderTotal,
      paymentMethod,
      status: "pending",
      shippingAddress: {
        fullName: `${formData.firstName} ${formData.lastName}`,
        address: formData.address,
        city: formData.city,
        phone: formData.phone,
        email: formData.email,
        notes: formData.notes,
      },
      orderDate: new Date().toISOString(),
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error: any) {
    console.error("ORDER_CREATE_ERROR:", error);
    return new NextResponse(error.message || "Error Interno del Servidor", { status: 500 });
  }
}
