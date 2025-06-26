import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth-options';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: { contextId: number; documentIds: number[] } = await req.json();
    if (!body.contextId || !body.documentIds) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    await prisma.contextDocument.createMany({
      data: body.documentIds.map((documentId) => ({
        contextId: body.contextId,
        documentId,
      })),
    });

    const context = await prisma.context.findUnique({
      where: { id: body.contextId },
      include: {
        documents: {
          include: {
            document: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        data: context,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Error creating context:', error);
    return NextResponse.json({ error: 'Failed to create context' }, { status: 500 });
  }
}
