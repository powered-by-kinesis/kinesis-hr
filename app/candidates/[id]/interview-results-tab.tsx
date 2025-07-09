'use client';

import {
    Play,
    Star,
    Badge as BadgeIcon,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface SkillAssessment {
    name: string;
    level: string;
    rating: 'Senior' | 'Experienced' | 'Excellent' | 'Good' | 'Basic';
    icon?: React.ReactNode;
}

const mockSkillAssessments: SkillAssessment[] = [
    {
        name: 'B2B sales',
        level: '8+ yrs experience',
        rating: 'Senior',
        icon: <BadgeIcon className="h-4 w-4" />,
    },
    {
        name: 'Human Data Management',
        level: '2+ yrs experience',
        rating: 'Senior',
        icon: <BadgeIcon className="h-4 w-4" />,
    },
    {
        name: 'Hubspot CRM',
        level: '4+ yrs experience',
        rating: 'Experienced',
        icon: <BadgeIcon className="h-4 w-4" />,
    },
    {
        name: 'SaaS solutions',
        level: '8+ yrs experience',
        rating: 'Experienced',
        icon: <BadgeIcon className="h-4 w-4" />,
    },
    {
        name: 'Soft skills',
        level: 'C1 (Excellent)',
        rating: 'Excellent',
        icon: <BadgeIcon className="h-4 w-4" />,
    },
];

function getRatingColor(rating: string): string {
    switch (rating) {
        case 'Senior':
            return 'bg-green-100 text-green-800 border-green-200';
        case 'Experienced':
            return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'Excellent':
            return 'bg-purple-100 text-purple-800 border-purple-200';
        case 'Good':
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
    }
}

export function InterviewResultsTab() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1 h-fit">
                <CardHeader>
                    <CardTitle>Skills Assessment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {mockSkillAssessments.map((skill, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between p-4 border rounded-lg"
                        >
                            <div className="flex items-center gap-3">
                                {skill.icon}
                                <div>
                                    <p className="font-medium text-sm">{skill.name}</p>
                                    <p className="text-xs text-muted-foreground">{skill.level}</p>
                                </div>
                            </div>
                            <Badge
                                variant="secondary"
                                className={getRatingColor(skill.rating)}
                            >
                                {skill.rating}
                            </Badge>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <div className="lg:col-span-2 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Interview Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-green-400 opacity-50"></div>
                            <Button
                                variant="secondary"
                                size="lg"
                                className="relative z-10 rounded-full w-16 h-16 p-0"
                            >
                                <Play className="h-6 w-6 ml-1" />
                            </Button>
                        </div>
                        <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden text-center text-black font-bold ">
                            Transcript text here
                        </div>
                    </CardContent>

                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>AI Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        </div>
                        <div className="space-y-2">
                            <h4 className="font-medium">Key Strengths</h4>
                            <div className="flex flex-wrap gap-2">
                                {['test', 'test2'].map((strength, index) => (
                                    <Badge key={index} variant="secondary">
                                        {strength}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
} 