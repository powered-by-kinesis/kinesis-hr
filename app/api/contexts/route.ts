import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth-options';
import { CreateContextRequestDTO } from '@/types/context/CreateContextRequestDTO';

export async function POST(req: Request) {
  try {
    // todo to dify
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: CreateContextRequestDTO = await req.json();

    const context = await prisma.context.create({
      data: {
        jobDescription: body.jobDescription,
        localLanguage: body.localLanguage,
        userId: session.user.id,
        documents: {
          create: body.documentIds.map((documentId) => ({
            document: {
              connect: {
                id: documentId,
              },
            },
          })),
        },
      },
      include: {
        documents: {
          include: {
            document: true,
          },
        },
        user: true,
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

export async function GET(_req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const contexts = await prisma.context.findMany({
      where: {
        userId: session.user.id,
        deletedAt: null,
      },
      include: {
        documents: true,
        user: true,
        candidates: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      data: contexts,
    });
  } catch (error) {
    console.error('Error fetching contexts:', error);
    return NextResponse.json({ error: 'Failed to fetch contexts' }, { status: 500 });
  }
}
