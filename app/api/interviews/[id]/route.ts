import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { InterviewResponseDTO, UpdateInterviewRequestDTO } from '@/types/interview';

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    const interview = await prisma.interview.findUnique({
        where: { id: parseInt(id) },
        include: {
            jobPost: true,
            invitations: {
                include: {
                    applicant: {
                        include: {
                            applications: true, // Include applications for applicant status
                        },
                    },
                    interview: true, // Include interview details
                },
            },
        },
    });

    if (!interview) {
        return NextResponse.json({ message: 'Interview not found' }, { status: 404 });
    }

    return NextResponse.json(interview);
}

export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } },
): Promise<NextResponse<InterviewResponseDTO | { message: string }>> {
    try {
        const { id } = params;
        const body = await req.json();
        const { interviewName, skills, customQuestionList, jobPostId } =
            UpdateInterviewRequestDTO.parse(body);

        const updatedInterview = await prisma.interview.update({
            where: { id: parseInt(id) },
            data: {
                interviewName,
                skills: skills || [],
                customQuestionList: customQuestionList || [],
                jobPostId,
            },
        });

        return NextResponse.json(updatedInterview);
    } catch (error: unknown) {
        console.error('Error updating interview:', error);
        return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
    }
}

export async function DELETE(
    _req: NextRequest,
    { params }: { params: { id: string } },
): Promise<NextResponse<{ message: string }>> {
    const { id } = params;
    try {
        await prisma.interview.delete({
            where: { id: parseInt(id) },
        });
        return NextResponse.json({ message: 'Interview deleted successfully' });
    } catch (error: unknown) {
        console.error('Error deleting interview:', error);
        return NextResponse.json({ message: 'Error deleting interview' }, { status: 500 });
    }
}
