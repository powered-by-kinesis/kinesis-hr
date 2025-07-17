import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse<{ message: string }>> {
  const { id } = await params;
  try {
    await prisma.interviewInvitation.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ message: 'Interview invitation deleted successfully' });
  } catch (error: unknown) {
    console.error('Error deleting interview invitation:', error);
    return NextResponse.json({ message: 'Error deleting interview invitation' }, { status: 500 });
  }
}
