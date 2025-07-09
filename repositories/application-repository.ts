// Application Repository - handles all application related API calls

import { ApplicationResponseDTO } from '@/types/application';

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
    application: ApplicationResponseDTO,
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

  async deleteApplication(id: number): Promise<{ message: string }> {
    try {
      const res = await fetch(`${this.baseUrl}/api/applications/${id}`, {
        method: 'DELETE',
        cache: 'no-store',
      });
      return res.json();
    } catch (error) {
      console.error('Error deleting application:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const applicationRepository = new ApplicationRepository();
