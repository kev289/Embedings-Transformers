import { NextResponse } from 'next/server';
import { prisma } from '@/src/lib/prisma';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

const getSecretKey = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("Error JWT");
    return new TextEncoder().encode(secret);
};

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Email y contraseña son obligatorios" }, { status: 400 });
        }

        const usuario = await prisma.user.findUnique({
            where: { email }
        });

        if (!usuario) {
            return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
        }

        const passwordCorrecta = await bcrypt.compare(password, usuario.password);

        if (!passwordCorrecta) {
            return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
        }

        const token = await new SignJWT({ userId: usuario.id, email: usuario.email })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('7d')
            .sign(getSecretKey());

        // 4. Preparamos la respuesta exitosa
        const response = NextResponse.json({ 
            message: "Login exitoso", 
            userId: usuario.id 
        });

        response.cookies.set({
            name: 'auth_token',
            value: token,
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        });

        return response;

    } catch (error) {
        console.error("Error en login:", error);
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }
}