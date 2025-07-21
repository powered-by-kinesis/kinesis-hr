import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { CreateInterviewRequestDTO, InterviewResponseDTO } from '@/types/interview';
import { v4 as uuidv4 } from 'uuid';
import { addHours } from 'date-fns';

export async function GET(_req: NextRequest): Promise<NextResponse<InterviewResponseDTO[]>> {
  const interviews = await prisma.interview.findMany({
    include: {
      jobPost: true, // Include jobPost relation
      invitations: {
        // Changed from applicants to invitations
        include: {
          applicant: {
            include: {
              applications: true, // Include applications for applicant status
            },
          }, // Include applicant relation
          interview: true, // Include interview relation
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return NextResponse.json(interviews as unknown as InterviewResponseDTO[]);
}

export async function POST(
  req: NextRequest,
): Promise<NextResponse<InterviewResponseDTO | { message: string }>> {
  try {
    const body = await req.json();
    const { interviewName, skills, customQuestionList, jobPostId, applicantIds } =
      CreateInterviewRequestDTO.parse(body);

    const newInterview = await prisma.interview.create({
      data: {
        interviewName,
        skills: skills || [],
        customQuestionList: customQuestionList || [],
        jobPostId,
        invitations: {
          // Changed from applicants to invitations
          create:
            applicantIds?.map((applicantId) => ({
              applicant: {
                connect: { id: applicantId },
              },
              token: uuidv4(), // Generate a unique token for each invitation
              expiresAt: addHours(new Date(), 24 * 7), // Invitation expires in 7 days
            })) || [],
        },
      },
    });

    return NextResponse.json(newInterview, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating interview:', error);
    return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest): Promise<NextResponse<{ message: string }>> {
  try {
    const { ids } = await req.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { message: 'Invalid or empty array of IDs provided' },
        { status: 400 },
      );
    }

    await prisma.interview.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return NextResponse.json({ message: 'Interviews deleted successfully' });
  } catch (error: unknown) {
    console.error('Error deleting interviews:', error);
    return NextResponse.json({ message: 'Error deleting interviews' }, { status: 500 });
  }
}
