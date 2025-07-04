'use client';

import * as React from 'react';
import { CheckCircle, MapPin, Play, Clock, DollarSign, Star, Badge as BadgeIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { CandidateRankingResponseDTO } from '@/types/candidate-ranking';

interface CandidateDetailsModalProps {
    candidate: CandidateRankingResponseDTO | null;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onRequestInterview?: (candidateId: string) => void;
    onRegisterForTranscript?: () => void;
}

// Skill assessment data structure
interface SkillAssessment {
    name: string;
    level: string;
    rating: 'Senior' | 'Experienced' | 'Excellent' | 'Good' | 'Basic';
    icon?: React.ReactNode;
}

// Mock skill assessments based on the image
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

export function CandidateDetailsModal({
    candidate,
    isOpen,
    onOpenChange,
    onRequestInterview,
    onRegisterForTranscript
}: CandidateDetailsModalProps) {
    if (!candidate) return null;

    // Extract candidate data
    const {
        candidate_data: { name, summary, skills, experience },
        ai_analysis: { overall_score, key_strengths, justification },
        score,
        candidate_id,
    } = candidate;

    // Generate profile initials
    const initials = name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();

    // Mock additional data for display (in real app this would come from API)
    const mockProfileData = {
        avatar: null, // Would be actual image URL
        jobTitle: 'Senior Mid-Market Account Executive',
        location: 'United States',
        availability: 'Available full-time',
        experienceYears: '8+ years exp',
        hourlyRate: '$74/hour',
        verified: true,
    };

    const handleRequestInterview = () => {
        if (onRequestInterview) {
            onRequestInterview(candidate_id);
        }
        onOpenChange(false);
    };

    const handleRegisterForTranscript = () => {
        if (onRegisterForTranscript) {
            onRegisterForTranscript();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[90vw] lg:max-w-[1200px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Candidate Details</DialogTitle>
                    <DialogDescription>
                        Comprehensive overview of candidate profile and interview results
                    </DialogDescription>
                </DialogHeader>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
                    {/* Left Column - Candidate Profile */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardContent className="p-6">
                                {/* Profile Picture and Basic Info */}
                                <div className="text-center mb-6">
                                    <div className="relative inline-block mb-4">
                                        <Avatar className="w-20 h-20 mx-auto">
                                            <AvatarImage src={mockProfileData.avatar || undefined} alt={name} />
                                            <AvatarFallback className="text-xl font-semibold">
                                                {initials}
                                            </AvatarFallback>
                                        </Avatar>
                                        {mockProfileData.verified && (
                                            <CheckCircle className="absolute -top-1 -right-1 h-6 w-6 text-green-500 bg-white rounded-full" />
                                        )}
                                    </div>

                                    <div className="mb-4">
                                        <h2 className="text-xl font-bold flex items-center justify-center gap-2">
                                            {name}
                                            {mockProfileData.verified && (
                                                <CheckCircle className="h-5 w-5 text-green-500" />
                                            )}
                                        </h2>
                                        <p className="text-muted-foreground text-sm mt-1">
                                            {mockProfileData.jobTitle}
                                        </p>
                                    </div>

                                    {/* Location and Availability */}
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                            <MapPin className="h-4 w-4" />
                                            {mockProfileData.location}
                                        </div>
                                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                            <Clock className="h-4 w-4" />
                                            {mockProfileData.availability} | {mockProfileData.experienceYears}
                                        </div>
                                    </div>

                                    {/* Hourly Rate */}
                                    <div className="flex items-center justify-center gap-2 text-lg font-bold text-primary mb-4">
                                        <DollarSign className="h-5 w-5" />
                                        {mockProfileData.hourlyRate}
                                    </div>
                                </div>

                                {/* Summary */}
                                <div className="mb-6">
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {summary}
                                    </p>
                                </div>

                                {/* Request Interview Button */}
                                <Button
                                    className="w-full"
                                    onClick={handleRequestInterview}
                                >
                                    Request interview
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Interview Results */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Interview result summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Skills Assessment Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                </div>

                                {/* Recording Section */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold">Recording of the AI interview</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Video Player */}
                                        <div className="space-y-4">
                                            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                                                {/* Mock video thumbnail */}
                                                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-green-400 opacity-50"></div>
                                                <Button
                                                    variant="secondary"
                                                    size="lg"
                                                    className="relative z-10 rounded-full w-16 h-16 p-0"
                                                >
                                                    <Play className="h-6 w-6 ml-1" />
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Transcript */}
                                        <div className="space-y-4">
                                            <h4 className="font-medium">TRANSCRIPT</h4>
                                            <div className="bg-gray-50 rounded-lg p-6 text-center space-y-4">
                                                <div className="text-muted-foreground">
                                                    <p className="text-sm">Register to access</p>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    onClick={handleRegisterForTranscript}
                                                >
                                                    Register now
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* AI Analysis Summary */}
                                <div className="space-y-4">
                                    <h3 className="font-semibold">AI Analysis</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Star className="h-4 w-4 text-yellow-500" />
                                                <span className="font-medium">Overall Score</span>
                                            </div>
                                            <div className="text-2xl font-bold text-primary">
                                                {overall_score}/100
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Star className="h-4 w-4 text-blue-500" />
                                                <span className="font-medium">Match Score</span>
                                            </div>
                                            <div className="text-2xl font-bold text-primary">
                                                {score}/100
                                            </div>
                                        </div>
                                    </div>

                                    {/* Key Strengths */}
                                    {key_strengths && key_strengths.length > 0 && (
                                        <div className="space-y-2">
                                            <h4 className="font-medium">Key Strengths</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {key_strengths.map((strength, index) => (
                                                    <Badge key={index} variant="secondary">
                                                        {strength}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
} 