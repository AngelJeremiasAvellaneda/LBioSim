import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toPrismaModuleId } from "@/lib/module-mapping";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { moduleId } = await params;
    let prismaModuleId: string;
    try {
      prismaModuleId = toPrismaModuleId(moduleId);
    } catch {
      return NextResponse.json({ error: "Módulo desconocido" }, { status: 400 });
    }

    const current = await prisma.progress.findUnique({ where: { userId: session.user.id } });
    if (!current || !current.visitedModules.includes(prismaModuleId as any)) {
      await prisma.progress.upsert({
        where: { userId: session.user.id },
        update: { visitedModules: { push: prismaModuleId as any } },
        create: { userId: session.user.id, visitedModules: [prismaModuleId as any] },
      });
    }

    return NextResponse.json({ updated: true });
  } catch (error) {
    console.error("[PATCH /api/progress/[moduleId]]", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
