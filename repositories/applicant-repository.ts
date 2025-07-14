// Applicant Repository - handles all applicant related API calls

import { ApplicantResponseDTO } from '@/types/applicant';

export class ApplicantRepository {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  }

  /**
   * Fetch all applicants from the database
   * @returns Promise<Applicant[]>
   */
  async getAllApplicants(): Promise<ApplicantResponseDTO[]> {
    try {
      const res = await fetch(`${this.baseUrl}/api/applicants`, {
        cache: 'no-store', // Ensure fresh data
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch applicants: ${res.status} ${res.statusText}`);
      }

      return await res.json();
    } catch (error) {
      console.error('Error fetching applicants:', error);
      throw error;
    }
  }

  /**
   * Create a new applicant
   * @param applicantData - Applicant data to create
   * @returns Promise<Applicant>
   */
  async createApplicant(
    applicantData: Omit<ApplicantResponseDTO, 'id' | 'appliedAt'>,
  ): Promise<ApplicantResponseDTO> {
    try {
      const res = await fetch(`${this.baseUrl}/api/applicants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicantData),
      });

      if (!res.ok) {
        throw new Error(`Failed to create applicant: ${res.status} ${res.statusText}`);
      }

      return await res.json();
    } catch (error) {
      console.error('Error creating applicant:', error);
      throw error;
    }
  }

  /**
   * Get applicant by ID
   * @param id - Applicant ID
   * @returns Promise<Applicant>
   */
  async getApplicantById(id: number): Promise<ApplicantResponseDTO> {
    try {
      const res = await fetch(`${this.baseUrl}/api/applicants/${id}`, {
        cache: 'no-store',
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch applicant: ${res.status} ${res.statusText}`);
      }

      return await res.json();
    } catch (error) {
      console.error('Error fetching applicant by ID:', error);
      throw error;
    }
  }

  /**
   * Update applicant by ID
   * @param id - Applicant ID
   * @param applicantData - Updated applicant data
   * @returns Promise<Applicant>
   */
  async updateApplicant(
    id: number,
    applicantData: Partial<Omit<ApplicantResponseDTO, 'id'>>,
  ): Promise<ApplicantResponseDTO> {
    try {
      const res = await fetch(`${this.baseUrl}/api/applicants/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicantData),
      });

      if (!res.ok) {
        throw new Error(`Failed to update applicant: ${res.status} ${res.statusText}`);
      }

      return await res.json();
    } catch (error) {
      console.error('Error updating applicant:', error);
      throw error;
    }
  }

  /**
   * Send an invitation email to an applicant.
   * @param email - The recipient's email address.
   * @param interviewId - The ID of the interview to link in the invitation.
   * @returns Promise<{ success: boolean; messageId?: string; error?: any }>
   */
  async sendInvitation(email: string, interviewId: string): Promise<{ success: boolean; messageId?: string; error?: any }> {
    try {
      const res = await fetch(`${this.baseUrl}/api/applicants/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, interviewId }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || `Failed to send invitation: ${res.status} ${res.statusText}`);
      }

      return { success: true, messageId: (await res.json()).messageId };
    } catch (error) {
      console.error('Error sending invitation:', error);
      return { success: false, error };
    }
  }
}

// Export singleton instance
export const applicantRepository = new ApplicantRepository();
