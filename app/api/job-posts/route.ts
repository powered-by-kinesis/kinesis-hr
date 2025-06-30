import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import {
    CreateJobPostRequestDTO,
    JobPostResponseDTO,
} from '@/types/job-post';

export async function GET(
    req: NextRequest
): Promise<NextResponse<JobPostResponseDTO[]>> {
    const jobPosts = await prisma.jobPost.findMany();
    return NextResponse.json(jobPosts);
}

export async function POST(
    req: NextRequest
): Promise<NextResponse<JobPostResponseDTO | { message: string }>> {
    try {
        const body = await req.json();
        const { title, description, location, employmentType, status } =
            CreateJobPostRequestDTO.parse(body);

        const newJobPost = await prisma.jobPost.create({
            data: {
                title,
                description,
                location,
                employmentType,
                status,
            },
        });

        return NextResponse.json(newJobPost, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
    }
}
