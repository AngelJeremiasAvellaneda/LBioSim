import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { QUIZ_BANK } from "@/lib/molecular/quiz-bank";
import { z } from "zod";

const PostestSchema = z.object({
  responses: z.array(z.number().int().min(0).max(3)).length(10),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const progress = await prisma.progress.findUnique({
      where: { userId: session.user.id },
    });

    const visitedCount = progress?.visitedModules?.length ?? 0;
    if (visitedCount < 5) {
      return NextResponse.json({ error: "Debes visitar al menos 5 módulos antes del postest" }, { status: 400 });
    }

    const body = await req.json();
    const parsed = PostestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos", details: parsed.error.flatten() }, { status: 400 });
    }

    const { responses } = parsed.data;
    const questions = QUIZ_BANK.slice(-10);
    let score = 0;
    for (let i = 0; i < questions.length; i++) {
      if (responses[i] === questions[i].correctIdx) {
        score++;
      }
    }

    await prisma.evalSession.create({
      data: {
        userId: session.user.id,
        evalType: "SUMMATIVE",
        moduleIds: [],
        score,
      },
    });

    return NextResponse.json({ score, total: 10 });
  } catch (error) {
    console.error("[POST /api/evaluation/postest]", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
