import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { UpdateApplicationRequestDTO } from '@/types/application';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { candidateId } = await request.json();

    if (!candidateId) {
      return NextResponse.json({ message: 'Candidate ID is required' }, { status: 400 });
    }

    if (!id || isNaN(parseInt(id, 10))) {
      return NextResponse.json({ message: 'Invalid application ID' }, { status: 400 });
    }

    const jobPostId = parseInt(id, 10);

    // First check if the application exists
    const existingApplication = await prisma.application.findUnique({
      where: {
        applicantId_jobPostId: {
          applicantId: candidateId,
          jobPostId: jobPostId,
        },
      },
    });

    if (!existingApplication) {
      return NextResponse.json({ message: 'Application not found' }, { status: 404 });
    }

    await prisma.application.delete({
      where: {
        applicantId_jobPostId: {
          applicantId: candidateId,
          jobPostId: jobPostId,
        },
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting application:', error);
    return NextResponse.json(
      {
        message: 'Error deleting application',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
