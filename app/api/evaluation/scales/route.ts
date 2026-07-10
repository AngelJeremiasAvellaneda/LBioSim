import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const ScaleEvalType = z.enum(["SUS", "TAM", "NASA_TLX"]);

const ScaleBodySchema = z.object({
  evalType: ScaleEvalType,
  responses: z.array(z.number()),
});

function calculateScore(evalType: string, responses: number[]): number {
  switch (evalType) {
    case "SUS": {
      if (responses.length !== 10) throw new Error("SUS requiere 10 respuestas");
      let sum = 0;
      for (let i = 0; i < responses.length; i++) {
        if (i % 2 === 0) {
          sum += responses[i] - 1;
        } else {
          sum += 5 - responses[i];
        }
      }
      return Math.round(sum * 2.5 * 100) / 100;
    }
    case "TAM": {
      const avg = responses.reduce((a, b) => a + b, 0) / responses.length;
      return Math.round((avg / 7) * 100 * 100) / 100;
    }
    case "NASA_TLX": {
      if (responses.length !== 6) throw new Error("NASA_TLX requiere 6 respuestas");
      const avg = responses.reduce((a, b) => a + b, 0) / responses.length;
      return Math.round(avg * 100) / 100;
    }
    default:
      throw new Error("Tipo de escala inválido");
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = ScaleBodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos", details: parsed.error.flatten() }, { status: 400 });
    }

    const { evalType, responses } = parsed.data;

    let score: number;
    try {
      score = calculateScore(evalType, responses);
    } catch {
      return NextResponse.json({ error: "Respuestas inválidas para la escala seleccionada" }, { status: 400 });
    }

    await prisma.evalSession.create({
      data: {
        userId: session.user.id,
        evalType: "FORMATIVE",
        moduleIds: [],
        score,
      },
    });

    return NextResponse.json({ score });
  } catch (error) {
    console.error("[POST /api/evaluation/scales]", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
