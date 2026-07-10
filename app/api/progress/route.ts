import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { toPrismaModuleId } from "@/lib/module-mapping";

const VisitBodySchema = z.object({
  moduleId: z.string().min(1),
  durationMs: z.number().int().nonnegative(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const progress = await prisma.progress.upsert({
      where: { userId: session.user.id },
      update: {},
      create: { userId: session.user.id, visitedModules: [] },
    });

    const moduleVisits = await prisma.moduleVisit.findMany({
      where: { userId: session.user.id },
      orderBy: { visitedAt: "desc" },
    });

    return NextResponse.json({
      visitedModules: progress.visitedModules,
      totalTimeMs: progress.totalTimeMs,
      moduleVisits,
    });
  } catch (error) {
    console.error("[GET /api/progress]", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = VisitBodySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos", details: parsed.error.flatten() }, { status: 400 });
    }

    const { moduleId, durationMs } = parsed.data;
    let prismaModuleId: string;
    try {
      prismaModuleId = toPrismaModuleId(moduleId);
    } catch {
      return NextResponse.json({ error: "Módulo desconocido" }, { status: 400 });
    }

    const current = await prisma.progress.findUnique({ where: { userId: session.user.id } });
    const alreadyVisited = current?.visitedModules.includes(prismaModuleId as any);

    await prisma.$transaction([
      prisma.progress.upsert({
        where: { userId: session.user.id },
        update: {
          totalTimeMs: { increment: durationMs },
          visitedModules: alreadyVisited ? undefined : { push: prismaModuleId as any },
        },
        create: {
          userId: session.user.id,
          visitedModules: [prismaModuleId as any],
          totalTimeMs: durationMs,
        },
      }),
      prisma.moduleVisit.create({
        data: { userId: session.user.id, moduleId: prismaModuleId as any, durationMs },
      }),
    ]);

    return NextResponse.json({ updated: true });
  } catch (error) {
    console.error("[POST /api/progress]", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
