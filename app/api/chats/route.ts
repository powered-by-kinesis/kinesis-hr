import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import prisma from '@/lib/prisma';

export async function GET(_req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;

  try {
    const contexts = await prisma.context.findMany({
      where: {
        userId: userId,
        deletedAt: null,
      },
      include: {
        user: true,
        documents: {
          include: {
            document: true,
          },
        },
        chats: {
          where: {
            deletedAt: null,
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
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      data: contexts,
    });
  } catch (error) {
    console.error('Error retrieving chats:', error);
    return NextResponse.json({ error: 'Failed to retrieve chats' }, { status: 500 });
  }
}
