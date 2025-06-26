import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import prisma from '@/lib/prisma';

interface CandidateCreateData {
  candidateId: string;
  contextId: number;
  name: string;
  summary: string;
  skills: string[];
  experience: string[];
  score: number;
  overallScore: number;
  justification: string;
  keyStrengths: string[];
  keyWeaknesses: string[];
  redFlags: string[];
}

// Get candidates by contextId
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const contextId = searchParams.get('contextId');

    if (!contextId) {
      return NextResponse.json({ error: 'contextId is required' }, { status: 400 });
    }

    // Verify user owns this context
    const context = await prisma.context.findFirst({
      where: {
        id: parseInt(contextId),
        userId: session.user.id,
        deletedAt: null,
      },
    });

    if (!context) {
      return NextResponse.json({ error: 'Context not found' }, { status: 404 });
    }

    const candidates = await prisma.candidate.findMany({
      where: {
        contextId: parseInt(contextId),
        deletedAt: null,
      },
      orderBy: {
        score: 'desc', // Highest score first
      },
    });

    return NextResponse.json({
      data: candidates,
    });
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return NextResponse.json({ error: 'Failed to fetch candidates' }, { status: 500 });
  }
}

// Create multiple candidates (bulk insert)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const candidatesData = await req.json();

    if (!Array.isArray(candidatesData) || candidatesData.length === 0) {
      return NextResponse.json({ error: 'Invalid candidates data' }, { status: 400 });
    }

    // Verify user owns the context
    const contextId = candidatesData[0]?.contextId;
    if (!contextId) {
      return NextResponse.json({ error: 'contextId is required' }, { status: 400 });
    }

    const context = await prisma.context.findFirst({
      where: {
        id: contextId,
        userId: session.user.id,
        deletedAt: null,
      },
    });

    if (!context) {
      return NextResponse.json({ error: 'Context not found' }, { status: 404 });
    }

    // Use transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx) => {
      // Hard delete existing candidates for this context (permanent)
      await tx.candidate.deleteMany({
        where: {
          contextId: contextId,
        },
      });

      // Create new candidates
      const candidates = await tx.candidate.createMany({
        data: candidatesData.map((candidate: CandidateCreateData) => ({
          candidateId: candidate.candidateId || `candidate_${Date.now()}`,
          contextId: candidate.contextId,
          name: candidate.name || 'Unknown Candidate',
          summary: candidate.summary || 'No summary provided',
          skills: candidate.skills || [],
          experience: candidate.experience || [],
          score: candidate.score || 0,
          overallScore: candidate.overallScore || 0,
          justification: candidate.justification || 'No justification provided',
          keyStrengths: candidate.keyStrengths || [],
          keyWeaknesses: candidate.keyWeaknesses || [],
          redFlags: candidate.redFlags || [],
        })),
      });

      return candidates;
    });

    return NextResponse.json({
      message: 'Candidates created successfully',
      count: result.count,
    });
  } catch (error) {
    console.error('Error creating candidates:', error);
    return NextResponse.json({ error: 'Failed to create candidates' }, { status: 500 });
  }
}
