import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { UpdateJobPostRequestDTO, JobPostResponseDTO } from '@/types/job-post';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<JobPostResponseDTO | { message: string }>> {
  const { id } = await params;
  const jobPost = await prisma.jobPost.findUnique({
    where: { id: parseInt(id) },
    include: {
      applications: {
        include: {
          applicant: true,
          stageHistory: {
            include: {
              changedBy: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
            orderBy: {
              changedAt: 'desc',
            },
          },
        },
        orderBy: {
          appliedAt: 'desc',
        },
      },
    },
  });

  if (!jobPost) {
    return NextResponse.json({ message: 'Job post not found' }, { status: 404 });
  }

  return NextResponse.json(jobPost);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<JobPostResponseDTO | { message: string }>> {
  try {
    const { id } = await params;
    const body = await req.json();
    const {
      title,
      description,
      location,
      employmentType,
      status,
      department,
      salaryMin,
      salaryMax,
      salaryType,
      currency,
    } = UpdateJobPostRequestDTO.parse(body);

    const updatedJobPost = await prisma.jobPost.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        location,
        employmentType,
        status,
        department,
        salaryMin,
        salaryMax,
        salaryType,
        currency,
      },
    });

    return NextResponse.json(updatedJobPost);
  } catch (error: unknown) {
    console.error('Error updating job post:', error);
    return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<{ message: string }>> {
  const { id } = await params;
  await prisma.jobPost.delete({
    where: { id: parseInt(id) },
  });

  return NextResponse.json({ message: 'Job post deleted successfully' });
}
