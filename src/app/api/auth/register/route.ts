import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        const { email, password, name } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email y contraseña son obligatorios" }, { status: 400 });
        }

        const usuarioExistente = await prisma.user.findUnique({
            where: { email }
        });

        if (usuarioExistente) {
            return NextResponse.json({ error: "El correo ya está registrado" }, { status: 400 });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const nuevoUsuario = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
            }
        });

        console.log("Nuevo usuario registrado:", nuevoUsuario.email);

        return NextResponse.json({
            message: "Usuario creado exitosamente",
            userId: nuevoUsuario.id
        });

    } catch (error) {
        console.error("Error en registro:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}