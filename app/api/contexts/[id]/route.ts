import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import prisma from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const context = await prisma.context.findUnique({
      where: {
        id: parseInt(id),
        userId: session.user.id,
        deletedAt: null,
      },
      include: {
        documents: {
          include: {
            document: true,
          },
        },
        chats: true,
      },
    });

    if (!context) {
      return NextResponse.json({ error: 'Context not found' }, { status: 404 });
    }

    return NextResponse.json(context);
  } catch (error) {
    console.error('Error fetching context:', error);
    return NextResponse.json({ error: 'Failed to fetch context' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const context = await prisma.context.update({
      where: {
        id: parseInt(id),
        userId: session.user.id,
      },
      data: {
        deletedAt: new Date(),
      },
    });

    return NextResponse.json(context);
  } catch (error) {
    console.error('Error deleting context:', error);
    return NextResponse.json({ error: 'Failed to delete context' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Verify user authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Parse and validate request body
    const body = await req.json();
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    // Update context in database
    const context = await prisma.context.update({
      where: {
        id: parseInt(id),
        userId: session.user.id,
      },
      data: body,
      include: {
        documents: {
          include: {
            document: true,
          },
        },
        candidates: {
          where: {
            deletedAt: null,
          },
          orderBy: {
            score: 'desc',
          },
        },
      },
    });

    return NextResponse.json(context);
  } catch (error) {
    console.error('Error updating context:', error);
    return NextResponse.json({ error: 'Failed to update context' }, { status: 500 });
  }
}
