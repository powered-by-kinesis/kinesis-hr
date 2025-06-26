'use client';

import { Card } from '@/components/ui/card';
import { CandidateRankingResponseDTO } from '@/types/candidate-ranking';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'; // Corrected import for ScrollArea and ScrollBar
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton
import { Button } from '@/components/ui/button'; // Import Button
import { RefreshCwIcon } from 'lucide-react'; // Import RefreshCwIcon

interface RankListProps {
  rankings: CandidateRankingResponseDTO[];
  isRankLoading: boolean;
  rankError: string | null;
  onGetCandidateRank: () => void;
}

export function RankList({
  rankings,
  isRankLoading,
  rankError,
  onGetCandidateRank,
}: RankListProps) {
  return (
    <ScrollArea className="h-[calc(100dvh-200px)] w-full rounded-md">
      <div className="space-y-4 p-4">
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            size="icon"
            onClick={onGetCandidateRank}
            disabled={isRankLoading}
            className="flex items-center"
          >
            {isRankLoading ? (
              <RefreshCwIcon className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCwIcon className="w-4 h-4" />
            )}
          </Button>
        </div>
        {isRankLoading ? (
          <>
            <Skeleton className="h-[60px] w-full" />
            <Skeleton className="h-[60px] w-full" />
          </>
        ) : rankError ? (
          <div className="text-center text-red-500">{rankError}</div>
        ) : rankings && rankings.length > 0 ? (
          rankings.map((ranking, index) => (
            <Card key={ranking.candidate_id} className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                  <span className="text-lg font-bold text-primary-foreground">#{index + 1}</span>
                </div>
                <div className="space-y-1">
                  <h3 className="font-semibold">{ranking.candidate_data.name}</h3>
                  <p className="text-sm text-muted-foreground">Score: {ranking.score}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div>
                  <h4 className="font-semibold">AI Analysis:</h4>
                  <p className="text-muted-foreground">{ranking.ai_analysis.justification}</p>
                </div>
                <div>
                  <h4 className="font-semibold">Key Strengths:</h4>
                  <ul className="list-disc list-inside text-muted-foreground">
                    {ranking.ai_analysis.key_strengths.map((strength: string, i: number) => (
                      <li key={i}>{strength}</li>
                    ))}
                  </ul>
                </div>
                {ranking.ai_analysis.key_weaknesses &&
                  ranking.ai_analysis.key_weaknesses.length > 0 && (
                    <div>
                      <h4 className="font-semibold">Key Weaknesses:</h4>
                      <ul className="list-disc list-inside text-muted-foreground">
                        {ranking.ai_analysis.key_weaknesses.map((weakness: string, i: number) => (
                          <li key={i}>{weakness}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                {ranking.ai_analysis.red_flags && ranking.ai_analysis.red_flags.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-red-600">Red Flags:</h4>
                    <ul className="list-disc list-inside text-red-500">
                      {ranking.ai_analysis.red_flags.map((flag: string, i: number) => (
                        <li key={i}>{flag}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center text-muted-foreground">No rankings available.</div>
        )}
      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
}
