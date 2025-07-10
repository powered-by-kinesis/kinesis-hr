import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { UpdateApplicantRequestDTO } from '@/types/applicant';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const applicant = await prisma.applicant.findUnique({
    where: {
      id: parseInt(id, 10),
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
    return NextResponse.json({ message: 'Applicant not found' }, { status: 404 });
  }

  return NextResponse.json(applicant);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const validation = UpdateApplicantRequestDTO.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(validation.error.errors, { status: 400 });
    }

    const { fullName, email, phone } = validation.data;

    const updatedApplicant = await prisma.applicant.update({
      where: {
        id: parseInt(id, 10),
      },
      data: {
        fullName,
        email,
        phone,
      },
    });

    return NextResponse.json(updatedApplicant);
  } catch (error) {
    return NextResponse.json({ message: 'Error updating applicant', error }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await prisma.applicant.delete({
      where: {
        id: parseInt(id, 10),
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting applicant', error }, { status: 500 });
  }
}
