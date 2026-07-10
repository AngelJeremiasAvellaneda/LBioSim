import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { toPrismaModuleId } from "@/lib/module-mapping";

const CreateSessionSchema = z.object({
  moduleId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = CreateSessionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos", details: parsed.error.flatten() }, { status: 400 });
    }

    let prismaModuleId: string | undefined;
    if (parsed.data.moduleId) {
      try {
        prismaModuleId = toPrismaModuleId(parsed.data.moduleId);
      } catch {
        return NextResponse.json({ error: "Módulo desconocido" }, { status: 400 });
      }
    }

    const quizSession = await prisma.quizSession.create({
      data: {
        userId: session.user.id,
        moduleId: prismaModuleId as any,
        score: 0,
        totalQuestions: 10,
      },
    });

    return NextResponse.json({ sessionId: quizSession.id }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/quiz/sessions]", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
