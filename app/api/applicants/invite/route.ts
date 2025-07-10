import { NextResponse } from 'next/server';
import { mailService } from '@/services/mail/mail-service';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { email, interviewId } = await req.json();

        if (!email || !interviewId) {
            return NextResponse.json({ error: 'Email and Interview ID are required' }, { status: 400 });
        }

        // Find the applicant by email
        const applicant = await prisma.applicant.findUnique({
            where: { email },
        });

        if (!applicant) {
            return NextResponse.json({ error: 'Applicant not found' }, { status: 404 });
        }

        // Generate a unique token
        const token = uuidv4();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // Token valid for 7 days

        // Save the invitation to the database
        await prisma.interviewInvitation.create({
            data: {
                token,
                applicantId: applicant.id,
                interviewId: parseInt(interviewId),
                expiresAt,
            },
        });

        const interviewLink = `${process.env.NEXT_PUBLIC_BASE_URL}/interview/${interviewId}?token=${token}`;

        // Define the subject and message template
        const subject = 'Invitation to AI Interview';
        const message = `
      <p>Dear ${applicant.fullName},</p>
      <p>You are invited to take an AI interview. Please click the link below to start:</p>
      <p><a href="${interviewLink}">Start Interview</a></p>
      <p>This link is valid for 7 days.</p>
      <p>Best regards,</p>
      <p>The Kinesis HR Team</p>
    `;

        const result = await mailService.sendMail({ to: email, subject, html: message });

        if (!result.success) {
            console.error('Failed to send email:', result.error);
            return NextResponse.json({ error: 'Failed to send invitation email' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Invitation sent successfully', messageId: result.messageId });
    } catch (error) {
        console.error('Error inviting applicant:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
