import prisma from '@/lib/prisma';
import { InterviewResponseDTO, CreateInterviewRequestDTO, UpdateInterviewRequestDTO } from '@/types/interview';
import { ValidationResponseDTO } from '@/types/interview/ValidationResponseDTO';
import { LivekitRoomResponseDto, TCreateLivekitRoomDto } from '@/types/livekit';

export class InterviewRepository {
    private baseUrl: string;

    constructor() {
        this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    }

    async getAllInterviews(): Promise<InterviewResponseDTO[]> {
        try {
            const res = await fetch(`${this.baseUrl}/api/interviews`, {
                cache: 'no-store',
            });

            if (!res.ok) {
                throw new Error(`Failed to fetch interviews: ${res.status} ${res.statusText}`);
            }

            return await res.json();
        } catch (error) {
            console.error('Error fetching interviews:', error);
            throw error;
        }
    }

    async createInterview(interviewData: CreateInterviewRequestDTO): Promise<InterviewResponseDTO> {
        try {
            const res = await fetch(`${this.baseUrl}/api/interviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(interviewData),
            });

            if (!res.ok) {
                throw new Error(`Failed to create interview: ${res.status} ${res.statusText}`);
            }

            return await res.json();
        } catch (error) {
            console.error('Error creating interview:', error);
            throw error;
        }
    }

    async getInterviewById(id: number): Promise<InterviewResponseDTO> {
        try {
            const res = await fetch(`${this.baseUrl}/api/interviews/${id}`, {
                cache: 'no-store',
            });

            if (!res.ok) {
                throw new Error(`Failed to fetch interview: ${res.status} ${res.statusText}`);
            }

            return await res.json();
        } catch (error) {
            console.error('Error fetching interview by ID:', error);
            throw error;
        }
    }

    async updateInterview(id: number, interviewData: UpdateInterviewRequestDTO): Promise<InterviewResponseDTO> {
        try {
            const res = await fetch(`${this.baseUrl}/api/interviews/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(interviewData),
            });

            if (!res.ok) {
                throw new Error(`Failed to update interview: ${res.status} ${res.statusText}`);
            }

            return await res.json();
        } catch (error) {
            console.error('Error updating interview:', error);
            throw error;
        }
    }

    async deleteInterview(id: number): Promise<{ message: string }> {
        try {
            const res = await fetch(`${this.baseUrl}/api/interviews/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                throw new Error(`Failed to delete interview: ${res.status} ${res.statusText}`);
            }

            return await res.json();
        } catch (error) {
            console.error('Error deleting interview:', error);
            throw error;
        }
    }

    async deleteMultipleInterviews(ids: number[]): Promise<{ message: string }> {
        try {
            const res = await fetch(`${this.baseUrl}/api/interviews`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ids }),
            });

            if (!res.ok) {
                throw new Error(`Failed to delete multiple interviews: ${res.status} ${res.statusText}`);
            }

            return await res.json();
        } catch (error) {
            console.error('Error deleting multiple interviews:', error);
            throw error;
        }
    }

    async validateInvitation(token: string, interviewId: number): Promise<ValidationResponseDTO> {
        try {
            const res = await fetch(`${this.baseUrl}/api/interviews/validate?token=${token}&interviewId=${interviewId}`);
            const validationData: ValidationResponseDTO = await res.json();
            if (!validationData || typeof validationData.success !== 'boolean') {
                throw new Error('Invalid response format from validation endpoint');
            }
            if (!res.ok) {
                throw new Error(!validationData.success ? "Failed to validate invitation" : `Failed to validate invitation: ${res.status} ${res.statusText}`);
            }

            return validationData;
        } catch (error) {
            console.error('Error validating invitation:', error);
            throw error;
        }
    }

    async validateInvitationByToken(token: string): Promise<ValidationResponseDTO> {
        try {
            const res = await fetch(`${this.baseUrl}/api/interviews/validate?token=${token}`);
            const validationData: ValidationResponseDTO = await res.json();
            if (!validationData || typeof validationData.success !== 'boolean') {
                throw new Error('Invalid response format from validation endpoint');
            }
            if (!res.ok) {
                throw new Error(!validationData.success ? "Failed to validate invitation" : `Failed to validate invitation: ${res.status} ${res.statusText}`);
            }

            return validationData;
        } catch (error) {
            console.error('Error validating invitation:', error);
            throw error;
        }
    }

    async createLivekitRoom(payload: TCreateLivekitRoomDto): Promise<LivekitRoomResponseDto> {
        try {
            const res = await fetch(`${this.baseUrl}/api/livekit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error(`Failed to create Livekit room: ${res.status} ${res.statusText}`);
            }

            return await res.json();
        } catch (error) {
            console.error('Error creating Livekit room:', error);
            throw error;
        }
    }
}

export const interviewRepository = new InterviewRepository();
