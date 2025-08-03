import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const applicant = await prisma.applicant.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive',
        },
      },
      include: {
        applications: {
          include: {
            jobPost: true,
            documents: {
              include: {
                document: true,
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
