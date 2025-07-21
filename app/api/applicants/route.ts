import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { CreateApplicantRequestDTO } from '@/types/applicant';

export async function GET() {
  const applicants = await prisma.applicant.findMany({
    orderBy: {
      appliedAt: 'desc',
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
  return NextResponse.json(applicants);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = CreateApplicantRequestDTO.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(validation.error.errors, { status: 400 });
    }

    const { fullName, email, phone } = validation.data;

    const newApplicant = await prisma.applicant.create({
      data: {
        fullName,
        email,
        phone,
      },
    });

    return NextResponse.json(newApplicant, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating applicant', error }, { status: 500 });
  }
}
