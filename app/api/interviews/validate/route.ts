import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');
    const interviewId = searchParams.get('interviewId');

    if (!token || !interviewId) {
      return NextResponse.json({ error: 'Token and Interview ID are required' }, { status: 400 });
    }

    const invitation = await prisma.interviewInvitation.findUnique({
      where: {
        token: token,
        interviewId: parseInt(interviewId),
      },
      include: {
        applicant: true, // Include applicant data if needed on the frontend
      },
    });

    if (!invitation) {
      return NextResponse.json(
        { error: 'Invalid invitation token or interview ID' },
        { status: 404 },
      );
    }

    if (invitation.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Invitation token has expired' }, { status: 401 });
    }

    // Token is valid
    return NextResponse.json({ success: true, data: invitation }, { status: 200 });
  } catch (error) {
    console.error('Error validating invitation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
