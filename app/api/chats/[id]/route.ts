import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import difyClient from '@/lib/dify-client';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: 'Conversation ID is required' }, { status: 400 });
  }

  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!id) {
      return NextResponse.json({ error: 'Conversation ID is required' }, { status: 400 });
    }

    const user = session.user.id.toString();

    const { data } = await difyClient.get(`/messages?user=${user}&conversation_id=${id}`);

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Error fetching Dify conversation:', error);
    return NextResponse.json({ error: 'Failed to fetch conversation history' }, { status: 500 });
  }
}
