import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: 'contextId is required' }, { status: 400 });
  }

  try {
    const documents = await prisma.contextDocument.findMany({
      where: {
        contextId: Number(id),
        document: {
          ownerId: userId,
        },
      },
      select: {
        document: true,
      },
    });

    const transformedDocuments = documents.map((doc) => doc.document);

    return NextResponse.json(
      {
        data: transformedDocuments,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error retrieving documents:', error);
    return NextResponse.json({ error: 'Failed to retrieve documents' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: 'Document ID is required' }, { status: 400 });
  }

  try {
    await prisma.document.delete({
      where: { id: Number(id), ownerId: userId },
    });

    return NextResponse.json({ message: 'Document deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 });
  }
}
