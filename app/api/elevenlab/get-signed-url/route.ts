import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const agentId = searchParams.get('agent_id');

  if (agentId === undefined || agentId === null) {
    return NextResponse.json({ error: 'Agent ID is required' }, { status: 400 });
  }

  const elevenLabsApiKey = process.env.ELEVENLABS_API_KEY;
  if (!elevenLabsApiKey) {
    return NextResponse.json({ error: 'ElevenLabs API Key not configured' }, { status: 500 });
  }

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${agentId}`,
      {
        headers: {
          'xi-api-key': elevenLabsApiKey,
        },
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to get signed URL from ElevenLabs: ${response.statusText} - ${errorData.detail || JSON.stringify(errorData)}`,
      );
    }

    const data = await response.json();
    return NextResponse.json({ signedUrl: data.signed_url });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return NextResponse.json(
      { error: `Failed to generate signed URL: ${(error as Error).message}` },
      { status: 500 },
    );
  }
}
