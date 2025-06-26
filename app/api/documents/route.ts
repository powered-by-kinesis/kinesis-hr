/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Document } from '@prisma/client'; // Import the Document type from Prisma
import prisma from '@/lib/prisma';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[]; // Client should send files under the 'files' key

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files provided' }, { status: 400 });
    }

    const uploadResults: Document[] = []; // Store saved document records from Prisma
    const uploadErrors: { fileName: string; error: string }[] = [];

    for (const file of files) {
      if (file && file.name && file.size > 0) {
        try {
          // Convert File to buffer
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const originalFileName = file.name.split('.')[0];
          const fileExtension = file.name.split('.').pop();

          // Upload to Cloudinary
          const result: UploadApiResponse = await new Promise((resolve, reject) => {
            cloudinary.uploader
              .upload_stream(
                {
                  resource_type: 'raw',
                  folder: `documents/${userId}`,
                  public_id: `${Date.now()}-${originalFileName}.${fileExtension}`,
                  original_filename: file.name,
                  use_filename: true,
                  unique_filename: false,
                  format: fileExtension,
                },
                (error, result) => {
                  if (error) reject(error);
                  else if (result) resolve(result);
                  else reject(new Error('Cloudinary upload failed without error object.'));
                },
              )
              .end(buffer);
          });

          const savedDocument = await prisma.document.create({
            data: {
              ownerId: userId,
              fileName: file.name,
              filePath: result.secure_url,
              fileSize: result.bytes,
              fileType: result.format || file.type.split('/')[1] || 'pdf',
            },
          });

          uploadResults.push(savedDocument); // Now returning the saved document from Prisma
        } catch (uploadError: any) {
          console.error(`Error uploading file ${file.name} to Cloudinary:`, uploadError);
          const errorMessage = uploadError.message || 'Failed to upload file to Cloudinary';
          uploadErrors.push({ fileName: file.name, error: errorMessage });
        }
      }
    }

    if (uploadErrors.length > 0 && uploadResults.length === 0) {
      // All uploads failed
      return NextResponse.json(
        { error: 'All file uploads failed', details: uploadErrors },
        { status: 500 },
      );
    }

    // Return successful uploads and any errors for partial success
    return NextResponse.json(
      {
        message:
          uploadErrors.length > 0 ? 'Some files failed to upload' : 'Files uploaded successfully',
        data: uploadResults,
        errors: uploadErrors.length > 0 ? uploadErrors : undefined,
      },
      { status: uploadErrors.length > 0 ? 207 : 200 },
    ); // 207 Multi-Status for partial success
  } catch (error) {
    console.error('Error in file upload handler:', error);
    return NextResponse.json({ error: 'Failed to process file uploads' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;

  // Get difyConversationId from query parameters
  const { searchParams } = new URL(req.url);
  const difyConversationId = searchParams.get('difyConversationId');

  if (!difyConversationId) {
    return NextResponse.json({ error: 'difyConversationId is required' }, { status: 400 });
  }

  try {
    const documents = await prisma.chat.findFirst({
      where: {
        difyConversationId: difyConversationId,
        context: {
          userId: userId,
        },
      },
      select: {
        context: {
          select: {
            documents: {
              select: {
                document: true,
              },
              where: {
                document: {
                  ownerId: userId,
                },
              },
            },
          },
        },
      },
    });

    if (!documents) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    const flattenedDocuments = documents.context.documents.map((doc) => doc.document);

    return NextResponse.json(
      {
        data: flattenedDocuments,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error in file upload handler:', error);
    return NextResponse.json({ error: 'Failed to process file uploads' }, { status: 500 });
  }
}
