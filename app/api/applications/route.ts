import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { CreateApplicationRequestDTO } from '@/types/application';

export async function GET() {
  const applications = await prisma.application.findMany({
    include: {
      applicant: true,
    },
  });
  return NextResponse.json(applications);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = CreateApplicationRequestDTO.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(validation.error.errors, { status: 400 });
    }

    const { fullName, email, phone, resumeUrl, jobPostId, expectedSalary, notes } = validation.data;

    let applicant = await prisma.applicant.findUnique({
      where: { email },
    });

    if (!applicant) {
      applicant = await prisma.applicant.create({
        data: {
          fullName,
          email,
          phone,
          resumeUrl,
        },
      });
    }

    const existingApplication = await prisma.application.findFirst({
      where: {
        applicantId: applicant.id,
        jobPostId,
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { message: 'You have already applied for this job' },
        { status: 409 },
      );
    }

    const newApplication = await prisma.application.create({
      data: {
        jobPostId,
        applicantId: applicant.id,
        expectedSalary,
        notes,
      },
      include: {
        applicant: true,
      },
    });

    return NextResponse.json(newApplication, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating application', error }, { status: 500 });
  }
}
