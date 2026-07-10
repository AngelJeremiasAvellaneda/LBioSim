import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const SaveSimulationSchema = z.object({
  sequence: z.string().min(2).max(24).regex(/^[ATCG]+$/),
  result: z.enum(["accepted", "rejected"]),
  steps: z.number().int().nonnegative(),
  duration: z.number().nonnegative(),
  algorithm: z.string(),
  baseCount: z.object({
    A: z.number().int().nonnegative(),
    T: z.number().int().nonnegative(),
    C: z.number().int().nonnegative(),
    G: z.number().int().nonnegative(),
  }),
});

// POST /api/simulations — save a completed simulation
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = SaveSimulationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const session = await getServerSession(authOptions);

    const simulation = await prisma.simulation.create({
      data: {
        ...parsed.data,
        userId: session?.user?.id ?? null,
      },
    });

    return NextResponse.json(simulation, { status: 201 });
  } catch (error) {
    console.error("[POST /api/simulations]", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

// GET /api/simulations — list simulations for the current user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") ?? "20")));
    const skip = (page - 1) * limit;

    const [simulations, total] = await Promise.all([
      prisma.simulation.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.simulation.count({ where: { userId: session.user.id } }),
    ]);

    return NextResponse.json({
      data: simulations,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("[GET /api/simulations]", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
