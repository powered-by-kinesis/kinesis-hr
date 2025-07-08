// Job Post Repository - handles all job post related API calls

import { JobPostResponseDTO } from '@/types/job-post';
import { CreateJobPostRequestDTO } from '@/types/job-post/CreateJobPostRequestDTO';
import { UpdateJobPostRequestDTO } from '@/types/job-post/UpdateJobPostRequestDTO';

export class JobPostRepository {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  }

  /**
   * Fetch all job posts from the database
   * @returns Promise<JobPost[]>
   */
  async getAllJobPosts(): Promise<JobPostResponseDTO[]> {
    try {
      const res = await fetch(`${this.baseUrl}/api/job-posts`, {
        cache: 'no-store', // Ensure fresh data
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch job posts: ${res.status} ${res.statusText}`);
      }

      return await res.json();
    } catch (error) {
      console.error('Error fetching job posts:', error);
      throw error;
    }
  }

  /**
   * Create a new job post
   * @param jobPostData - Job post data to create
   * @returns Promise<JobPost>
   */
  async createJobPost(jobPostData: CreateJobPostRequestDTO): Promise<JobPostResponseDTO> {
    try {
      const res = await fetch(`${this.baseUrl}/api/job-posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobPostData),
      });

      if (!res.ok) {
        throw new Error(`Failed to create job post: ${res.status} ${res.statusText}`);
      }

      return await res.json();
    } catch (error) {
      console.error('Error creating job post:', error);
      throw error;
    }
  }

  /**
   * Get job post by ID
   * @param id - Job post ID
   * @returns Promise<JobPost>
   */
  async getJobPostById(id: number): Promise<JobPostResponseDTO> {
    try {
      const res = await fetch(`${this.baseUrl}/api/job-posts/${id}`, {
        cache: 'no-store',
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch job post: ${res.status} ${res.statusText}`);
      }

      return await res.json();
    } catch (error) {
      console.error('Error fetching job post by ID:', error);
      throw error;
    }
  }

  /**
   * Delete a job post by ID
   * @param id - Job post ID to delete
   * @returns Promise<{ message: string }>
   */
  async deleteJobPost(id: number): Promise<{ message: string }> {
    try {
      const res = await fetch(`${this.baseUrl}/api/job-posts/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error(`Failed to delete job post: ${res.status} ${res.statusText}`);
      }

      return await res.json();
    } catch (error) {
      console.error('Error deleting job post:', error);
      throw error;
    }
  }

  async updateJobPost(id: number, data: UpdateJobPostRequestDTO): Promise<JobPostResponseDTO> {
    const response = await fetch(`${this.baseUrl}/api/job-posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update job post');
    }

    return response.json();
  }
}

// Export singleton instance
export const jobPostRepository = new JobPostRepository();
