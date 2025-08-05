import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { CreateInterviewRequestDTO, InterviewResponseDTO } from '@/types/interview';
import { v4 as uuidv4 } from 'uuid';
import { addHours } from 'date-fns';
import { mailService } from '@/services/mail/mail-service';

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

    // First, get all applicants' information
    const applicants = await prisma.applicant.findMany({
      where: {
        id: {
          in: applicantIds || [],
        },
      },
      select: {
        id: true,
        email: true,
        fullName: true,
      },
    });

    // Create the interview with invitations
    await prisma.interview.create({
      data: {
        interviewName,
        skills: skills || [],
        customQuestionList: customQuestionList || [],
        jobPostId,
        invitations: {
          create: applicants.map((applicant) => {
            const token = uuidv4(); // Generate a unique token for each invitation
            const expiresAt = addHours(new Date(), 24 * 7); // 7 days expiry

            // Send invitation email
            const interviewLink = `${process.env.NEXT_PUBLIC_BASE_URL}/interview/meet?token=${token}`;
            const subject = 'Invitation to AI Interview';
            const message = `
              <p>Dear ${applicant.fullName},</p>
              <p>You are invited to take an AI interview for "${interviewName}". Please click the link below to start:</p>
              <p><a href="${interviewLink}">Start Interview</a></p>
              <p>This link is valid for 7 days.</p>
              <p>You can track your progress in the <a href="${process.env.NEXT_PUBLIC_BASE_URL}/announcement/applicant">Announcement Page</a>.</p>
              <p>Best regards,</p>
              <p>The Kinesis HR Team</p>
            `;

            // Send email asynchronously
            mailService
              .sendMail({
                to: applicant.email,
                subject,
                html: message,
              })
              .catch((error) => {
                console.error(`Failed to send email to ${applicant.email}:`, error);
              });

            // Return the invitation data
            return {
              applicant: {
                connect: { id: applicant.id },
              },
              token,
              expiresAt,
            };
          }),
        },
      },
      include: {
        invitations: {
          include: {
            applicant: true,
          },
        },
      },
    });

    return NextResponse.json({ message: 'Interview created successfully' }, { status: 201 });
  } catch (error: unknown) {
    console.error('Error creating interview:', error);
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Invalid request body',
      },
      { status: 400 },
    );
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
