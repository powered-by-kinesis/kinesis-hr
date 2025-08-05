import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const emailWithoutSpaces = email.replace(/\s/g, '');

    const applicant = await prisma.applicant.findFirst({
      where: {
        email: {
          equals: emailWithoutSpaces,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        applications: {
          select: {
            id: true,
            currentStage: true,
            jobPost: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });

    if (!applicant) {
      return NextResponse.json({ error: 'Applicant not found' }, { status: 404 });
    }

    return NextResponse.json(applicant);
  } catch (error) {
    console.error('Error checking applicant:', error);
    return NextResponse.json({ error: 'Failed to check applicant status' }, { status: 500 });
  }
}
