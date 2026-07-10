import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const MAX_SEQUENCES = 10;

const CreateSequenceSchema = z.object({
  name: z.string().min(1).max(80),
  sequence: z.string().min(4).max(200).regex(/^[ATCG]+$/),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const sequences = await prisma.virtualLabSequence.findMany({
      where: { userId: session.user.id },
      orderBy: { savedAt: "desc" },
      take: MAX_SEQUENCES,
    });

    return NextResponse.json({ data: sequences });
  } catch (error) {
    console.error("[GET /api/lab/sequences]", error);
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
    const parsed = CreateSequenceSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Datos inválidos", details: parsed.error.flatten() }, { status: 400 });
    }

    const { name, sequence } = parsed.data;

    const count = await prisma.virtualLabSequence.count({
      where: { userId: session.user.id },
    });

    if (count >= MAX_SEQUENCES) {
      return NextResponse.json({ error: "Límite de 10 secuencias alcanzado" }, { status: 400 });
    }

    const newSequence = await prisma.virtualLabSequence.create({
      data: { userId: session.user.id, name, sequence },
    });

    return NextResponse.json(newSequence, { status: 201 });
  } catch (error) {
    console.error("[POST /api/lab/sequences]", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
