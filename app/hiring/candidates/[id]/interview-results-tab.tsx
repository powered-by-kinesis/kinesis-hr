'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SkillLevel } from '@/constants/enums/skill-level';
import { SkillLevelBadge } from '@/components/molecules/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface SkillAssessment {
  skill_name: string;
  skill_level: SkillLevel;
  assessment_notes: string;
}

interface Data {
  skills: SkillAssessment[];
  summary: string;
}

export function InterviewResultsTab({ data }: { data: Data }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1 h-fit">
        <CardHeader>
          <CardTitle>Skills Assessment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {data?.skills && data.skills.length > 0 ? (
            data.skills.map((skill, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <p className="font-medium text-sm">{skill.skill_name}</p>
                </div>
                <SkillLevelBadge level={skill.skill_level} />
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center p-4 border rounded-lg">
              <p className="font-medium text-sm">No skills assessment available</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Interview Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ScrollArea className="h-[300px]">
              <div className="overflow-hidden text-start text-black font-medium p-4">
                {data?.summary}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">

            {
              data.skills.map((skill, index) => (
                <div key={index} className="flex  flex-col justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <p className="font-medium text-sm">{skill.skill_name}</p>
                  </div>
                  {/* explanation */}
                  <div className="text-sm text-muted-foreground">
                    {skill.assessment_notes || 'No notes provided'}
                  </div>
                </div>
              ))
            }
            {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">Overall Score</span>
                </div>
                <div className="text-2xl font-bold text-primary">100/100</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">Match Score</span>
                </div>
                <div className="text-2xl font-bold text-primary">100/100</div>
              </div>
            </div> */}
            {/* <div className="space-y-2">
              <h4 className="font-medium">Key Strengths</h4>
              <div className="flex flex-wrap gap-2">
                {['test', 'test2'].map((strength, index) => (
                  <Badge key={index} variant="secondary">
                    {strength}
                  </Badge>
                ))}
              </div>
            </div> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
