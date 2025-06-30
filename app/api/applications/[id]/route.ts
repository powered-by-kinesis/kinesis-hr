import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { UpdateApplicationRequestDTO } from '@/types/application';

interface IParams {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: IParams) {
  const { id } = params;
  const application = await prisma.application.findUnique({
    where: {
      id: parseInt(id, 10),
    },
    include: {
      applicant: true,
    },
  });

  if (!application) {
    return NextResponse.json({ message: 'Application not found' }, { status: 404 });
  }

  return NextResponse.json(application);
}

export async function PUT(request: Request, { params }: IParams) {
  const { id } = params;
  try {
    const body = await request.json();
    const validation = UpdateApplicationRequestDTO.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(validation.error.errors, { status: 400 });
    }

    const { currentStage, notes } = validation.data;

    const updatedApplication = await prisma.application.update({
      where: {
        id: parseInt(id, 10),
      },
      data: {
        currentStage,
        notes,
      },
    });

    return NextResponse.json(updatedApplication);
  } catch (error) {
    return NextResponse.json({ message: 'Error updating application', error }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: IParams) {
  const { id } = params;
  try {
    await prisma.application.delete({
      where: {
        id: parseInt(id, 10),
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting application', error }, { status: 500 });
  }
}
