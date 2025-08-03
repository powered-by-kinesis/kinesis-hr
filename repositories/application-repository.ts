// Application Repository - handles all application related API calls

import { ApplicationResponseDTO, UpdateApplicationRequestDTO } from '@/types/application';

export class ApplicationRepository {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  }

  async getAllApplications(): Promise<ApplicationResponseDTO[]> {
    try {
      const res = await fetch(`${this.baseUrl}/api/applications`, {
        cache: 'no-store',
      });
      return res.json();
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
  }

  async getApplicationById(id: number): Promise<ApplicationResponseDTO> {
    try {
      const res = await fetch(`${this.baseUrl}/api/applications/${id}`, {
        cache: 'no-store',
      });
      return res.json();
    } catch (error) {
      console.error('Error fetching application by ID:', error);
      throw error;
    }
  }

  async createApplication(application: ApplicationResponseDTO): Promise<ApplicationResponseDTO> {
    try {
      const res = await fetch(`${this.baseUrl}/api/applications`, {
        method: 'POST',
        body: JSON.stringify(application),
        cache: 'no-store',
      });
      return res.json();
    } catch (error) {
      console.error('Error creating application:', error);
      throw error;
    }
  }

  async updateApplication(
    id: number,
    application: UpdateApplicationRequestDTO,
  ): Promise<ApplicationResponseDTO> {
    try {
      const res = await fetch(`${this.baseUrl}/api/applications/${id}`, {
        method: 'PUT',
        body: JSON.stringify(application),
        cache: 'no-store',
      });
      return res.json();
    } catch (error) {
      console.error('Error updating application:', error);
      throw error;
    }
  }

  async deleteApplication(
    applicationId: number,
    candidateId: number,
  ): Promise<{ success: boolean }> {
    try {
      const response = await fetch(`${this.baseUrl}/api/applications/${applicationId}`, {
        method: 'DELETE',
        cache: 'no-store',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ candidateId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        return { success: false };
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting application:', error);
      return { success: false };
    }
  }
}

// Export singleton instance
export const applicationRepository = new ApplicationRepository();
