import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';

vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    progress: { upsert: vi.fn(), findUnique: vi.fn() },
    moduleVisit: { create: vi.fn(), findMany: vi.fn() },
    quizSession: { create: vi.fn() },
    virtualLabSequence: { count: vi.fn(), create: vi.fn(), findMany: vi.fn() },
    evalSession: { findMany: vi.fn() },
    $transaction: vi.fn((args: unknown[]) => Promise.all(args)),
  },
}));

import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { GET as GetProgress, POST as PostProgress } from '@/app/api/progress/route';
import { POST as PostQuizSession } from '@/app/api/quiz/sessions/route';
import { POST as PostLabSequence } from '@/app/api/lab/sequences/route';
import { GET as GetAdminResearch } from '@/app/api/admin/research/route';

describe('GET /api/progress', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 without auth', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);

    const req = new NextRequest('http://localhost/api/progress');
    const res = await GetProgress(req);

    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe('No autenticado');
  });

  it('returns structure with auth', async () => {
    vi.mocked(getServerSession).mockResolvedValue({ user: { id: 'test-user' } });
    vi.mocked(prisma.progress.upsert).mockResolvedValue({ visitedModules: [], totalTimeMs: 0 } as any);
    vi.mocked(prisma.moduleVisit.findMany).mockResolvedValue([]);

    const req = new NextRequest('http://localhost/api/progress');
    const res = await GetProgress(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ visitedModules: [], totalTimeMs: 0, moduleVisits: [] });
  });
});

describe('POST /api/progress', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates ModuleVisit', async () => {
    vi.mocked(getServerSession).mockResolvedValue({ user: { id: 'test-user' } });
    vi.mocked(prisma.progress.findUnique).mockResolvedValue({ visitedModules: [] } as any);
    vi.mocked(prisma.progress.upsert).mockResolvedValue({ visitedModules: ['DNA_REPLICATION'] } as any);
    vi.mocked(prisma.moduleVisit.create).mockResolvedValue({ id: 'mv-1' } as any);

    const req = new NextRequest('http://localhost/api/progress', {
      method: 'POST',
      body: JSON.stringify({ moduleId: 'replicacion', durationMs: 5000 }),
    });
    const res = await PostProgress(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ updated: true });
  });
});

describe('POST /api/quiz/sessions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates session', async () => {
    vi.mocked(getServerSession).mockResolvedValue({ user: { id: 'test-user' } });
    vi.mocked(prisma.quizSession.create).mockResolvedValue({ id: 'session-1' } as any);

    const req = new NextRequest('http://localhost/api/quiz/sessions', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    const res = await PostQuizSession(req);

    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json).toEqual({ sessionId: 'session-1' });
  });
});

describe('POST /api/lab/sequences', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('with over limit returns 400', async () => {
    vi.mocked(getServerSession).mockResolvedValue({ user: { id: 'test-user' } });
    vi.mocked(prisma.virtualLabSequence.count).mockResolvedValue(10);

    const req = new NextRequest('http://localhost/api/lab/sequences', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test', sequence: 'ATCG' }),
    });
    const res = await PostLabSequence(req);

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe('Límite de 10 secuencias alcanzado');
  });
});

describe('GET /api/admin/research', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.ADMIN_IDS = 'admin-user-id';
  });

  it('returns CSV', async () => {
    vi.mocked(getServerSession).mockResolvedValue({ user: { id: 'admin-user-id' } });
    vi.mocked(prisma.evalSession.findMany).mockResolvedValue([
      { userId: 'user-1', evalType: 'pretest', score: 85, completedAt: new Date('2024-01-01') },
    ] as any);

    const req = new NextRequest('http://localhost/api/admin/research?format=csv');
    const res = await GetAdminResearch(req);

    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('text/csv');
  });
});
