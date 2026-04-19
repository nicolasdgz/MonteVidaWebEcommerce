import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.email) {
      return new NextResponse("No Autorizado", { status: 401 });
    }

    // Obtener las órdenes del usuario, junto con la imagen y el título del primer producto para la miniatura
    const userOrdersQuery = `
      *[_type == "order" && user->email == $email] | order(orderDate desc) {
        _id,
        orderNumber,
        orderDate,
        status,
        totalAmount,
        "items": items[]{
          quantity,
          priceAtPurchase,
          "productTitle": product->title,
          "productImage": product->mainImage.asset->url
        }
      }
    `;

    const orders = await client.fetch(userOrdersQuery, { email: session.user.email });

    return NextResponse.json({ orders }, { status: 200 });
  } catch (error: any) {
    console.error("ORDER_FETCH_ERROR:", error);
    return new NextResponse(error.message || "Error Interno del Servidor", { status: 500 });
  }
}
