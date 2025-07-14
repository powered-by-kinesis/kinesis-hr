import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { CreateApplicationRequestDTO } from '@/types/application';
import axios from 'axios';

export async function GET() {
  const applications = await prisma.application.findMany({
    include: {
      applicant: true,
    },
  });
  return NextResponse.json(applications);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const validation = CreateApplicationRequestDTO.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: 'Validation error', errors: validation.error.errors },
        { status: 400 },
      );
    }

    const { fullName, email, phone, jobPostId, expectedSalary, notes, documentIds } =
      validation.data;

    let applicant = await prisma.applicant.findUnique({
      where: { email },
    });

    if (!applicant) {
      applicant = await prisma.applicant.create({
        data: {
          fullName,
          email,
          phone,
        },
      });
    }

    const existingApplication = await prisma.application.findFirst({
      where: {
        applicantId: applicant.id,
        jobPostId,
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { message: 'You have already applied for this job' },
        { status: 409 },
      );
    }

    // Create application with document connections in a transaction
    const newApplication = await prisma.$transaction(async (tx) => {
      // Create the application first
      const application = await tx.application.create({
        data: {
          jobPostId,
          applicantId: applicant!.id,
          expectedSalary,
          notes,
        },
      });

      // Then create document connections
      if (documentIds && documentIds.length > 0) {
        await tx.applicationDocument.createMany({
          data: documentIds.map((documentId) => ({
            applicationId: application.id,
            documentId,
          })),
        });
      }

      // Return the created application with related data
      return tx.application.findUnique({
        where: { id: application.id },
        include: {
          applicant: true,
          documents: {
            include: {
              document: true,
            },
          },
        },
      });
    });

    if (!newApplication) {
      throw new Error('Failed to create application');
    }

    // embed document
    // temp code to simulate document embedding
    await axios.post('https://llmapi.nolepsekali.fun/publisher/publish', {
      event: "store-pdf",
      data: {
        file_urls: newApplication.documents.map(doc => doc.document.filePath),
        applicant_id: newApplication.applicant.id,
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    })

    return NextResponse.json(newApplication, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/applications:', error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : 'Error creating application' },
      { status: 500 },
    );
  }
}
