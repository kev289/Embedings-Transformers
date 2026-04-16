import { NextResponse } from 'next/server';
import { generateEmbedding, generateTransformerResponse } from '@/src/servicio/iaService';
import { prisma } from '@/src/lib/prisma';

export async function POST(req: Request) {
    try {
        const { query } = await req.json();

        if (!query) return NextResponse.json({ error: "Query is required" }, { status: 400 });

        const queryVector = await generateEmbedding(query);
        const transformacionTextual = await generateTransformerResponse(query);

        console.log("Vector y Transformación generados para:", query);

        // 1. Guardar en PostgreSQL convirtiendo nuestro array a un tipo vector de Postgres
        const vectorStr = `[${queryVector.join(",")}]`;

        await prisma.$executeRaw`
            INSERT INTO "Comparison" (text, vector, "transformation", "userId") 
            VALUES (${query}, ${vectorStr}::vector, ${transformacionTextual}, 1)
        `;

        console.log("Guardado en DB (PostgreSQL) usando vector type:", query);

        // REVISAR SI EXISTE EN DB
        const todos = await prisma.comparison.findMany();
        console.log("=== TOTAL REGISTROS EN LA BASE DE DATOS:", todos.length, "===");
        todos.forEach(t => console.log("=>", t.text));

        // 2. Buscar similitudes delegando el trabajo matemático a la base de datos (mucho más eficiente)
        // El operador <=> calcula la distancia coseno en pgvector.
        const dbResults = await prisma.$queryRaw<any[]>`
            SELECT text, 1 - (vector <=> ${vectorStr}::vector) AS similarity
            FROM "Comparison"
            ORDER BY similarity DESC
            LIMIT 5;
        `;

        // 3. Formatear resultados
        const results = dbResults.map((item) => ({
            text: item.text,
            similarity: (item.similarity * 100).toFixed(2) + "%"
        }));

        return NextResponse.json({
            query,
            transformacion: transformacionTextual,
            results
        });

    } catch (error) {
        console.error("Embedding Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}