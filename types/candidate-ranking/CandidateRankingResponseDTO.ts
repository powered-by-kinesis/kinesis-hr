// AI Response format (what we receive from AI service)
export type CandidateRankingResponseDTO = {
  ai_analysis: {
    justification: string;
    key_strengths: string[];
    key_weaknesses: string[];
    overall_score: number;
    red_flags: string[];
  };
  score: number;
  candidate_data: {
    name: string;
    summary: string;
    skills: string[];
    experience: Array<string | ExperienceObject>; // Can be strings or objects from AI
  };
  candidate_id: string;
  context_id?: number;
};

// Experience object format from AI service
export interface ExperienceObject {
  role?: string;
  company_name?: string;
  period?: string;
}
