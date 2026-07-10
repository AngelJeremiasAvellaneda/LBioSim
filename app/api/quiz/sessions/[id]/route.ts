import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const SubmitAnswersSchema = z.object({
  answers: z.array(
    z.object({
      questionId: z.string().min(1),
      selectedIdx: z.number().int().nonnegative(),
      correct: z.boolean(),
    })
  ),
  score: z.number().min(0),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { id } = await params;

    const quizSession = await prisma.quizSession.findUnique({
      where: { id },
      include: { answers: true },
    });

    if (!quizSession) {
      return NextResponse.json({ error: "Sesión no encontrada" }, { status: 404 });
    }

    if (quizSession.userId !== session.user.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    return NextResponse.json(quizSession);
  } catch (error) {
    console.error("[GET /api/quiz/sessions/[id]]", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.quizSession.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Sesión no encontrada" }, { status: 404 });
    }

    if (existing.userId !== session.user.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = SubmitAnswersSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos", details: parsed.error.flatten() }, { status: 400 });
    }

    const { answers, score } = parsed.data;
    const correct = answers.filter((a) => a.correct).length;
    const incorrect = answers.length - correct;

    await prisma.$transaction([
      prisma.quizAnswer.createMany({
        data: answers.map((a) => ({
          sessionId: id,
          questionId: a.questionId,
          selectedIdx: a.selectedIdx,
          correct: a.correct,
        })),
      }),
      prisma.quizSession.update({
        where: { id },
        data: { score, completedAt: new Date() },
      }),
    ]);

    return NextResponse.json({ score, correct, incorrect });
  } catch (error) {
    console.error("[PATCH /api/quiz/sessions/[id]]", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
