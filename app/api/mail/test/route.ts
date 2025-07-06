import { NextResponse } from 'next/server';
import { mailService } from '@/services/mail/mail-service';

export async function POST(request: Request) {
  try {
    const { to } = await request.json();

    if (!to) {
      return NextResponse.json({ error: 'Email address is required' }, { status: 400 });
    }

    const result = await mailService.sendMail({
      to,
      subject: 'Test Email from Kinesis HR',
      html: `
        <h1>Test Email</h1>
        <p>This is a test email from Kinesis HR mail service.</p>
        <p>If you receive this email, it means the mail service is working correctly!</p>
        <p>Time sent: ${new Date().toLocaleString()}</p>
      `,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to send email', details: result.error },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: 'Test email sent successfully',
      messageId: result.messageId,
    });
  } catch (error) {
    console.error('Error sending test email:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
