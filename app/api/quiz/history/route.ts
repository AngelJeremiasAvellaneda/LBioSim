import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const sessions = await prisma.quizSession.findMany({
      where: { userId: session.user.id },
      orderBy: { completedAt: "desc" },
      take: 10,
    });

    return NextResponse.json(sessions);
  } catch (error) {
    console.error("[GET /api/quiz/history]", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
