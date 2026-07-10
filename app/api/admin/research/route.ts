import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function isAdmin(userId: string): boolean {
  const adminIds = (process.env.ADMIN_IDS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  return adminIds.includes(userId);
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    if (!isAdmin(session.user.id)) {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format");

    if (format === "csv") {
      const sessions = await prisma.evalSession.findMany({
        select: { userId: true, evalType: true, score: true, completedAt: true },
        orderBy: { completedAt: "desc" },
      });

      const header = "anonymizedId,evalType,score,completedAt";
      const rows = sessions.map((s) => {
        const anonymizedId = s.userId.substring(0, 8);
        return `${anonymizedId},${s.evalType},${s.score},${s.completedAt.toISOString()}`;
      });

      const csvContent = [header, ...rows].join("\n");
      return new Response(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": 'attachment; filename="research-data.csv"',
        },
      });
    }

    const sessions = await prisma.evalSession.findMany({
      select: { evalType: true, score: true },
    });

    const groups: Record<string, number[]> = {};
    for (const s of sessions) {
      if (!groups[s.evalType]) groups[s.evalType] = [];
      groups[s.evalType].push(s.score);
    }

    const stats = Object.entries(groups).map(([evalType, scores]) => {
      const n = scores.length;
      const mean = scores.reduce((a, b) => a + b, 0) / n;
      const variance = scores.reduce((a, b) => a + (b - mean) ** 2, 0) / n;
      const stdDev = Math.sqrt(variance);
      return {
        evalType,
        count: n,
        mean: Math.round(mean * 100) / 100,
        stdDev: Math.round(stdDev * 100) / 100,
      };
    });

    return NextResponse.json({ stats });
  } catch (error) {
    console.error("[GET /api/admin/research]", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
