'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Mail, Phone, MapPin, Building, GraduationCap, Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';
import { useAIAssistant } from '@/hooks/use-ai-assistant/use-ai-assistant';
import { ApplicantResponseDTO } from '@/types/applicant';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ApplicationTable } from '@/components/organisms/application-table';
import { InterviewResultsTab } from './interview-results-tab';
import { SkillAssessment } from './interview-results-tab';
import { Badge } from '@/components/ui/badge';

interface Education {
  institution: string;
  degree: string;
  startDate: Date;
  endDate: Date;
}

interface Experience {
  company: string;
  role: string;
  startDate: Date;
  endDate: Date;
  description: string;
}

interface Language {
  language: string;
  proficiency: string;
}

interface CandidateDetailsClientProps {
  initialCandidate: ApplicantResponseDTO | null;
}

const getDocumentViewerUrl = (url: string | null): string => {
  if (!url) return '';
  return `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`;
};

export function CandidateDetailsClient({ initialCandidate }: CandidateDetailsClientProps) {
  const router = useRouter();
  const [candidate, setCandidate] = React.useState(initialCandidate);
  const { isMinimized: isAIAssistantMinimized } = useAIAssistant();
  const [activeTab, setActiveTab] = React.useState('info');

  React.useEffect(() => {
    setCandidate(initialCandidate);
  }, [initialCandidate]);

  const handleDataMutation = () => {
    router.refresh();
  };

  const resumeUrl = candidate?.applications?.[0]?.documents?.[0]?.document?.filePath;

  if (!candidate) {
    return <div className="p-6">Candidate not found.</div>;
  }

  return (
    <div
      className={cn(
        'flex flex-col gap-4 py-4 md:gap-6 md:py-6',
        !isAIAssistantMinimized && 'lg:mr-96',
      )}
    >
      <div className="px-4 lg:px-6">
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/hiring">Hiring</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>{candidate.fullName}</BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <Tabs defaultValue="info" className="space-y-4" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="info" className="cursor-pointer">
              Candidate Info
            </TabsTrigger>
            <TabsTrigger value="interview" className="cursor-pointer">
              Interview Results
            </TabsTrigger>
            <TabsTrigger value="applications" className="cursor-pointer">
              Applications
            </TabsTrigger>
          </TabsList>

          <div className="relative mt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                {activeTab === 'info' && (
                  <TabsContent value="info" forceMount className="w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <Card className="lg:col-span-1 h-fit bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                        <CardContent className="p-6">
                          <div className="flex flex-col items-center mb-6">
                            <h2 className="text-xl font-bold text-center">{candidate.fullName}</h2>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="w-4 h-4" />
                              <span>{candidate.email}</span>
                            </div>
                            {candidate.phone && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Phone className="w-4 h-4" />
                                <span>{candidate.phone}</span>
                              </div>
                            )}
                            {candidate.location && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="w-4 h-4" />
                                <span>{candidate.location}</span>
                              </div>
                            )}

                            {Array.isArray(candidate.education) &&
                              candidate.education.length > 0 && (
                                <div className="pt-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <GraduationCap className="w-4 h-4" />
                                    <span className="font-medium">Education</span>
                                  </div>
                                  <div className="space-y-2">
                                    {(candidate.education as unknown as Education[]).map(
                                      (edu, index) => (
                                        <Badge key={index} variant="secondary" className="mr-2">
                                          {edu.institution}
                                        </Badge>
                                      ),
                                    )}
                                  </div>
                                </div>
                              )}

                            {Array.isArray(candidate.experience) &&
                              candidate.experience.length > 0 && (
                                <div className="pt-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Building className="w-4 h-4" />
                                    <span className="font-medium">Experience</span>
                                  </div>
                                  <div className="space-y-2">
                                    {(candidate.experience as unknown as Experience[]).map(
                                      (exp, index) => (
                                        <Badge key={index} variant="secondary" className="mr-2">
                                          {exp.company}
                                        </Badge>
                                      ),
                                    )}
                                  </div>
                                </div>
                              )}

                            {Array.isArray(candidate.languages) &&
                              candidate.languages.length > 0 && (
                                <div className="pt-4">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Globe className="w-4 h-4" />
                                    <span className="font-medium">Languages</span>
                                  </div>
                                  <div className="space-y-2">
                                    {(candidate.languages as unknown as Language[]).map(
                                      (lang, index) => (
                                        <Badge key={index} variant="secondary" className="mr-2">
                                          {lang.language}
                                        </Badge>
                                      ),
                                    )}
                                  </div>
                                </div>
                              )}
                          </div>

                          {/* <Button className="w-full mt-6 cursor-pointer" size="lg">
                            Request Interview
                          </Button> */}
                        </CardContent>
                      </Card>

                      <Card className="lg:col-span-2 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Resume/CV
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="aspect-[8.5/11] bg-background/95 rounded-lg flex items-center justify-center relative overflow-hidden shadow-inner">
                            {resumeUrl ? (
                              <iframe
                                src={getDocumentViewerUrl(resumeUrl)}
                                className="w-full h-full rounded-lg"
                                title={`${candidate.fullName}'s Resume`}
                              />
                            ) : (
                              <div className="text-center text-muted-foreground">
                                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                <p>No CV available</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                )}
                {activeTab === 'interview' && (
                  <TabsContent value="interview" forceMount>
                    <InterviewResultsTab
                      data={{
                        skills: candidate.skills as unknown as SkillAssessment[],
                        summary: candidate.summary || 'No summary available',
                      }}
                    />
                  </TabsContent>
                )}
                {activeTab === 'applications' && (
                  <TabsContent value="applications" forceMount>
                    <ApplicationTable
                      data={candidate as ApplicantResponseDTO}
                      onDeleteApplication={handleDataMutation}
                      onEditApplication={handleDataMutation}
                    />
                  </TabsContent>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
