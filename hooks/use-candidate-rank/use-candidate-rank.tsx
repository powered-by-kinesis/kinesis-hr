/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from 'react';
import { CandidateRankingResponseDTO } from '@/types/candidate-ranking/CandidateRankingResponseDTO';
import { SendChatRequestDTO } from '@/types/chat/SendChatRequestDTO';
import { generateUUID } from '@/lib/generate_uuid';

export const useCandidateRank = () => {
  const [rankings, setRankings] = useState<CandidateRankingResponseDTO[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getCandidateRank = useCallback(
    async (contextId: number, refreshChatHistory?: () => Promise<void>) => {
      setLoading(true);
      setError(null);
      try {
        const requestBody: SendChatRequestDTO = {
          query: 'give me list of rank',
          responseMode: 'blocking',
          contextId: contextId,
          fn_call: 'candidate-rank',
        };

        const response = await fetch('/api/chats/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch candidate rank');
        }

        const data = await response.json();
        const parsedData = JSON.parse(data.answer);
        setRankings(parsedData.answer);

        const candidateData = parsedData.answer.map((item: CandidateRankingResponseDTO) => ({
          candidateId: generateUUID(),
          contextId: contextId,
          name: item.candidate_data.name || 'Unknown Candidate',
          summary: item.candidate_data.summary || 'No summary provided',
          skills: item.candidate_data.skills || [],
          experience: Array.isArray(item.candidate_data.experience)
            ? item.candidate_data.experience.map((exp: any) =>
                typeof exp === 'string'
                  ? exp
                  : `${exp.role || ''} at ${exp.company_name || ''} (${exp.period || ''})`,
              )
            : [],
          score: item.score || 0,
          overallScore: item.ai_analysis.overall_score || 0,
          justification: item.ai_analysis.justification || 'No justification provided',
          keyStrengths: item.ai_analysis.key_strengths || [],
          keyWeaknesses: item.ai_analysis.key_weaknesses || [],
          redFlags: item.ai_analysis.red_flags || [],
        }));

        const candidateResponse = await fetch('/api/candidates', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(candidateData),
        });

        if (!candidateResponse.ok) {
          const errorData = await candidateResponse.json();
          throw new Error(errorData.error || 'Failed to save candidate data');
        }
        // Refresh chat history to get updated candidates data
        if (refreshChatHistory) {
          await refreshChatHistory();
        }
      } catch (err) {
        setError((err as Error).message);
        console.error('Error fetching candidate rank:', err);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const loadExistingCandidates = useCallback((context: any) => {
    setLoading(true);
    setError(null);
    try {
      if (!context?.candidates || context.candidates.length === 0) {
        setRankings([]);
        return;
      }

      const transformedData = context.candidates.map((candidate: any) => ({
        candidate_id: candidate.candidateId,
        score: candidate.score,
        candidate_data: {
          name: candidate.name,
          summary: candidate.summary,
          skills: candidate.skills || [],
          experience: candidate.experience || [],
        },
        ai_analysis: {
          justification: candidate.justification || '',
          key_strengths: candidate.keyStrengths || [],
          key_weaknesses: candidate.keyWeaknesses || [],
          overall_score: candidate.overallScore || 0,
          red_flags: candidate.redFlags || [],
        },
      }));

      setRankings(transformedData);
    } catch (err) {
      setError((err as Error).message);
      console.error('Error loading existing candidates:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshRank = useCallback(
    (contextId: number, refreshChatHistory?: () => Promise<void>) => {
      getCandidateRank(contextId, refreshChatHistory);
    },
    [getCandidateRank],
  );

  return { rankings, loading, error, getCandidateRank, refreshRank, loadExistingCandidates };
};
