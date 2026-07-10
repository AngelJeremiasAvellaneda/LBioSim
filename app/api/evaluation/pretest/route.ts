import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { QUIZ_BANK } from "@/lib/molecular/quiz-bank";
import { z } from "zod";

const PretestSchema = z.object({
  responses: z.array(z.number().int().min(0).max(3)).length(10),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const existingPretest = await prisma.evalSession.findFirst({
      where: { userId: session.user.id, evalType: "FORMATIVE" },
    });

    if (existingPretest) {
      return NextResponse.json({ error: "Ya has completado el pretest" }, { status: 400 });
    }

    const body = await req.json();
    const parsed = PretestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos", details: parsed.error.flatten() }, { status: 400 });
    }

    const { responses } = parsed.data;
    const questions = QUIZ_BANK.slice(0, 10);
    let score = 0;
    for (let i = 0; i < questions.length; i++) {
      if (responses[i] === questions[i].correctIdx) {
        score++;
      }
    }

    await prisma.evalSession.create({
      data: {
        userId: session.user.id,
        evalType: "FORMATIVE",
        moduleIds: [],
        score,
      },
    });

    return NextResponse.json({ score, total: 10 });
  } catch (error) {
    console.error("[POST /api/evaluation/pretest]", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
