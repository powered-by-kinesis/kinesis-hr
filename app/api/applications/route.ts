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

    // Wrap everything in a single transaction
    const result = await prisma.$transaction(
      async (tx) => {
        // Check for existing applicant within transaction
        let applicant = await tx.applicant.findUnique({
          where: { email },
        });

        if (!applicant) {
          applicant = await tx.applicant.create({
            data: {
              fullName,
              email,
              phone,
            },
          });
        }

        // Check for existing application within transaction
        const existingApplication = await tx.application.findFirst({
          where: {
            applicantId: applicant.id,
            jobPostId,
          },
        });

        if (existingApplication) {
          throw new Error('You have already applied for this job');
        }

        // Create the application
        const application = await tx.application.create({
          data: {
            jobPostId,
            applicantId: applicant.id,
            expectedSalary,
            notes,
          },
        });

        // Create document connections if any
        if (documentIds && documentIds.length > 0) {
          await tx.applicationDocument.createMany({
            data: documentIds.map((documentId) => ({
              applicationId: application.id,
              documentId,
            })),
          });
        }

        // Fetch complete application data within transaction
        const completeApplication = await tx.application.findUnique({
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

        if (!completeApplication) {
          throw new Error('Failed to create application');
        }

        // Embed documents
        try {
          await axios.post(
            'http://31.97.109.148:8000/publisher/publish',
            {
              event: 'store-pdf',
              data: {
                file_urls: completeApplication.documents.map((doc) => doc.document.filePath),
                applicant_id: completeApplication.applicant.id,
              },
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            },
          );
        } catch (embedError) {
          // Log the error with fail the transaction
          console.error('Error embedding documents:', embedError);
          throw new Error('Failed to embed documents');
        }

        return completeApplication;
      },
      {
        // Transaction options for longer timeout due to external API call
        timeout: 30000, // 30 seconds
        maxWait: 35000, // 35 seconds maximum wait time
        isolationLevel: 'Serializable', // Highest isolation level
      },
    );

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/applications:', error);
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : 'Error creating application',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      {
        status:
          error instanceof Error && error.message === 'You have already applied for this job'
            ? 409
            : 500,
      },
    );
  }
}
