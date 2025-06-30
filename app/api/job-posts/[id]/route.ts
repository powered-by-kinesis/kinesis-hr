import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import {
    UpdateJobPostRequestDTO,
    JobPostResponseDTO,
} from '@/types/job-post';

interface IParams {
    params: Promise<{
        id: string;
    }>
}

export async function GET(
    req: NextRequest,
    { params }: IParams
): Promise<NextResponse<JobPostResponseDTO | { message: string }>> {
    const { id } = await params;
    const jobPost = await prisma.jobPost.findUnique({
        where: { id: parseInt(id) },
    });

    if (!jobPost) {
        return NextResponse.json({ message: 'Job post not found' }, { status: 404 });
    }

    return NextResponse.json(jobPost);
}

export async function PUT(
    req: NextRequest,
    { params }: IParams
): Promise<NextResponse<JobPostResponseDTO | { message: string }>> {
    try {
        const { id } = await params;
        const body = await req.json();
        const { title, description, location, employmentType, status } =
            UpdateJobPostRequestDTO.parse(body);

        const updatedJobPost = await prisma.jobPost.update({
            where: { id: parseInt(id) },
            data: {
                title,
                description,
                location,
                employmentType,
                status,
            },
        });

        return NextResponse.json(updatedJobPost);
    } catch (error) {
        return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: IParams
): Promise<NextResponse<{ message: string }>> {
    const { id } = await params;
    await prisma.jobPost.delete({
        where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: 'Job post deleted successfully' });
}
