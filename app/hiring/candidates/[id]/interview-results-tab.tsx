'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SkillLevel } from '@/constants/enums/skill-level';
import { SkillLevelBadge } from '@/components/molecules/badge';

export interface SkillAssessment {
  skill_name: string;
  skill_level: SkillLevel;
  assessment_notes: string;
}

interface Data {
  skills: SkillAssessment[];
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
                <SkillLevelBadge level={skill.skill_level.toUpperCase() as SkillLevel} />
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
            <CardTitle>AI Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {data?.skills &&
              data.skills.length > 0 &&
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
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
