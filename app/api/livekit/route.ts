import { NextResponse } from 'next/server';
import { AccessToken, type AccessTokenOptions, type VideoGrant } from 'livekit-server-sdk';
import prisma from '@/lib/prisma';
import { CreateLivekitRoomDto, LivekitRoomResponseDto } from '@/types/livekit';

const API_KEY = process.env.LIVEKIT_API_KEY;
const API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_URL = process.env.LIVEKIT_URL;

// don't cache the results
export const revalidate = 0;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { invitationInterviewId, roomName } = CreateLivekitRoomDto.parse(body);
        // get invitationInterview by id
        const invitationInterview = await prisma.interviewInvitation.findUniqueOrThrow({
            where: { id: invitationInterviewId },
            include: {
                applicant: true,
                interview: true
            }
        });
        const skills = (invitationInterview.interview.skills as Array<{ name: string; description: string }>).map(skill => `${skill.name}: ${skill.description}`).join(', ');
        const roomToken = await createParticipantToken(
            { identity: invitationInterview.token, name: invitationInterview.applicant.fullName },
            roomName,
            {
                applicant_name: invitationInterview.applicant.fullName,
                interview_time_limit: 17,
                applicant_id: invitationInterview.applicant.id,
                interview_invitation_id: invitationInterview.id,
                skills: skills
            }
        );

        const data: LivekitRoomResponseDto = {
            serverUrl: LIVEKIT_URL || '',
            roomName,
            roomToken: roomToken,
        };

        return NextResponse.json(data);
    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            return new NextResponse(error.message, { status: 500 });
        }
    }
}

type Metadata = {
    applicant_name: string;
    interview_time_limit: number;
    applicant_id: number;
    interview_invitation_id: number;
    skills: string; // "JavaScript: junior level about variable declaration, TypeScript: junior level, React: junior level"
    custom_question_list?: string; // optional, if provided
}

function createParticipantToken(userInfo: AccessTokenOptions, roomName: string, metadata: Metadata) {
    const at = new AccessToken(API_KEY, API_SECRET, {
        ...userInfo,
        ttl: '15m',
        metadata: JSON.stringify(metadata),
    });
    const grant: VideoGrant = {
        room: roomName,
        roomJoin: true,
        canPublish: true,
        canPublishData: true,
        canSubscribe: true,
    };
    at.addGrant(grant);
    return at.toJwt();
}
