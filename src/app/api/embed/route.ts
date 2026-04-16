import { NextResponse } from 'next/server';
import { generateEmbedding, generateTransformerResponse } from '@/src/servicio/iaService';
import { cosineSimilarity } from '@/src/lib/utils';
import { prisma } from '@/src/lib/prisma';

export async function POST(req: Request) {
    try {
        const { query } = await req.json();

        if (!query) return NextResponse.json({ error: "Query is required" }, { status: 400 });

        const queryVector = await generateEmbedding(query);
        const transformacionTextual = await generateTransformerResponse(query);

        console.log("Vector y Transformación generados para:", query);

        const nuevaComparacion = await prisma.comparison.create({
            data: {
                text: query,
                vector: JSON.stringify(queryVector),
                userId: 1,
                transformation: transformacionTextual
            }
        });

        console.log("Guardado en DB con ID:", nuevaComparacion.id);

        const comparacionesGuardadas = await prisma.comparison.findMany();

        const results = comparacionesGuardadas.map(item => {
            const dbVector = JSON.parse(item.vector);

            return {
                text: item.text,
                similarity: (cosineSimilarity(queryVector, dbVector) * 100).toFixed(2) + "%"
            };
        }).sort((a, b) => parseFloat(b.similarity) - parseFloat(a.similarity));

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