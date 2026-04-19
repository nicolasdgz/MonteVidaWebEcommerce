import { NextResponse } from "next/server";
import { headers } from "next/headers";
import bcrypt from "bcryptjs";
import { client } from "@/sanity/lib/client";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: Request) {
  const ip = (await headers()).get("x-forwarded-for") ?? "unknown";
  if (!rateLimit(ip, 5, 60_000)) {
    return new NextResponse("Demasiadas solicitudes. Intenta más tarde.", { status: 429 });
  }
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return new NextResponse("Faltan datos obligatorios", { status: 400 });
    }

    // Comprobar si existe alguien con ese correo
    const existingUserQuery = `*[_type == "user" && email == $email][0]`;
    const existingUser = await client.fetch(existingUserQuery, { email });

    if (existingUser) {
      return new NextResponse("El correo ya está registrado.", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Usar cliente con token para poder generar el usuario en Sanity
    const writeClient = client.withConfig({
      token: process.env.SANITY_API_TOKEN,
    });

    const newUser = await writeClient.create({
      _type: "user",
      name,
      email,
      password: hashedPassword,
      role: "customer",
      provider: "credentials",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    console.error("REGISTER_ERROR", error);
    return new NextResponse(error.message || "Error Interno del Servidor", { status: 500 });
  }
}
