import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { CreateJobPostRequestDTO, JobPostResponseDTO } from '@/types/job-post';

export async function GET(_req: NextRequest): Promise<NextResponse<JobPostResponseDTO[]>> {
  const jobPosts = await prisma.jobPost.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      applications: {
        include: {
          applicant: true,
          stageHistory: true,
        },
      },
    },
  });
  return NextResponse.json(jobPosts);
}

export async function POST(
  req: NextRequest,
): Promise<NextResponse<JobPostResponseDTO | { message: string }>> {
  try {
    const body = await req.json();
    const {
      title,
      description,
      department,
      location,
      employmentType,
      status,
      salaryMin,
      salaryMax,
      salaryType,
      currency,
    } = CreateJobPostRequestDTO.parse(body);

    const newJobPost = await prisma.jobPost.create({
      data: {
        title,
        description,
        department,
        location,
        employmentType,
        status,
        salaryMin,
        salaryMax,
        salaryType,
        currency,
      },
    });

    return NextResponse.json(newJobPost, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating job post:', error);
    return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
): Promise<NextResponse<JobPostResponseDTO | { message: string }>> {
  const { id } = await req.json();

  const deletedJobPost = await prisma.jobPost.delete({
    where: { id },
  });

  return NextResponse.json(deletedJobPost);
}
