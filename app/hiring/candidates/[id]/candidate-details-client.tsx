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
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

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

// Fallback viewer options
const getPDFViewerOptions = (url: string | null) => {
  if (!url) return [];

  return [
    // Primary: Google Docs viewer
    `https://docs.google.com/gview?url=${encodeURIComponent(url)}&embedded=true`,
    // Fallback 1: Mozilla PDF.js
    `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(url)}`,
    // Fallback 2: Direct PDF (if browser supports)
    url,
  ];
};

export function CandidateDetailsClient({ initialCandidate }: CandidateDetailsClientProps) {
  const router = useRouter();
  const [candidate, setCandidate] = React.useState(initialCandidate);
  const { isMinimized: isAIAssistantMinimized } = useAIAssistant();
  const [activeTab, setActiveTab] = React.useState('info');
  const [isCVLoading, setIsCVLoading] = React.useState(true);
  const [currentViewerIndex, setCurrentViewerIndex] = React.useState(0);
  const [hasError, setHasError] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    setCandidate(initialCandidate);
  }, [initialCandidate]);

  const handleDataMutation = () => {
    router.refresh();
  };

  const resumeUrl = candidate?.applications?.[0]?.documents?.[0]?.document?.filePath;
  const viewerOptions = getPDFViewerOptions(resumeUrl || null);

  // Try next viewer (used by both error and timeout)
  const tryNextViewer = React.useCallback((reason: 'error' | 'timeout') => {
    console.warn(`PDF viewer ${currentViewerIndex + 1} failed (${reason}), trying next option...`);

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Try next viewer option
    if (currentViewerIndex < viewerOptions.length - 1) {
      setCurrentViewerIndex(prev => prev + 1);
      setIsCVLoading(true);
    } else {
      // All options failed
      setIsCVLoading(false);
      setHasError(true);
    }
  }, [currentViewerIndex, viewerOptions.length]);

  // Handle CV loading success
  const handleCVLoad = React.useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsCVLoading(false);
    setHasError(false);
  }, []);

  // Handle CV loading error
  const handleCVError = React.useCallback(() => {
    tryNextViewer('error');
  }, [tryNextViewer]);

  // Reset states when resume URL changes
  React.useEffect(() => {
    if (resumeUrl) {
      setIsCVLoading(true);
      setCurrentViewerIndex(0);
      setHasError(false);
    } else {
      // Clear timeout if no resume URL
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }
  }, [resumeUrl]);

  // Start timeout when viewer changes
  React.useEffect(() => {
    if (isCVLoading && resumeUrl && !hasError) {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      const timeout = currentViewerIndex === 0 ? 5000 : 5000;

      timeoutRef.current = setTimeout(() => {
        tryNextViewer('timeout');
      }, timeout);
    }

    return () => {
      // Cleanup timeout on unmount
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [currentViewerIndex, isCVLoading, resumeUrl, hasError, tryNextViewer]);

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

        {/* Responsive tab selection: dropdown on mobile, tabs on desktop */}
        <div className="block md:hidden mb-4">
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="info">Candidate Info</SelectItem>
              <SelectItem value="interview">Interview Results</SelectItem>
              <SelectItem value="applications">Applications</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="block md:hidden relative mt-6">
          {activeTab === 'info' && (
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

                    {Array.isArray(candidate.education) && candidate.education.length > 0 && (
                      <div className="pt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <GraduationCap className="w-4 h-4" />
                          <span className="font-medium">Education</span>
                        </div>
                        <div className="space-y-2">
                          {(candidate.education as unknown as Education[]).map((edu, index) => (
                            <Badge key={index} variant="secondary" className="mr-2">
                              {edu.institution}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {Array.isArray(candidate.experience) && candidate.experience.length > 0 && (
                      <div className="pt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Building className="w-4 h-4" />
                          <span className="font-medium">Experience</span>
                        </div>
                        <div className="space-y-2">
                          {(candidate.experience as unknown as Experience[]).map((exp, index) => (
                            <Badge key={index} variant="secondary" className="mr-2">
                              {exp.company}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {Array.isArray(candidate.languages) && candidate.languages.length > 0 && (
                      <div className="pt-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Globe className="w-4 h-4" />
                          <span className="font-medium">Languages</span>
                        </div>
                        <div className="space-y-2">
                          {(candidate.languages as unknown as Language[]).map((lang, index) => (
                            <Badge key={index} variant="secondary" className="mr-2">
                              {lang.language}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="lg:col-span-2 space-y-6">
                {candidate?.summary && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ScrollArea className="max-h-[250px]">
                        <div className="overflow-hidden text-start text-black font-medium p-4">
                          {candidate.summary}
                        </div>
                      </ScrollArea>
                    </CardContent>
                  </Card>
                )}
                <Card className="bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Resume/CV
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-[8.5/11] bg-background/95 rounded-lg flex items-center justify-center relative overflow-hidden shadow-inner">
                      {resumeUrl ? (
                        <>
                          {isCVLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-background/95 z-10">
                              <div className="text-center text-muted-foreground">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                                <p>Loading CV... {currentViewerIndex > 0 && `(trying alternative viewer)`}</p>
                              </div>
                            </div>
                          )}
                          {hasError ? (
                            <div className="text-center text-muted-foreground p-4">
                              <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                              <p className="mb-2">Failed to load CV</p>
                              <a
                                href={resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline text-sm"
                              >
                                Download CV instead →
                              </a>
                            </div>
                          ) : (
                            <iframe
                              key={currentViewerIndex} // Force re-render when viewer changes
                              src={viewerOptions[currentViewerIndex] || ''}
                              className="w-full h-full rounded-lg"
                              title={`${candidate.fullName}'s Resume`}
                              onLoad={handleCVLoad}
                              onError={handleCVError}
                            />
                          )}
                        </>
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
            </div>
          )}
          {activeTab === 'interview' && (
            <InterviewResultsTab
              data={{
                skills: candidate.skills as unknown as SkillAssessment[],
              }}
            />
          )}
          {activeTab === 'applications' && (
            <ApplicationTable
              data={candidate as ApplicantResponseDTO}
              onDeleteApplication={handleDataMutation}
              onEditApplication={handleDataMutation}
            />
          )}
        </div>
        <div className="hidden md:block">
          <Tabs defaultValue={activeTab} className="space-y-4" onValueChange={setActiveTab}>
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
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  <TabsContent value="info">
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
                        </CardContent>
                      </Card>

                      <div className="lg:col-span-2 space-y-6">
                        {candidate?.summary && (
                          <Card>
                            <CardHeader>
                              <CardTitle>Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <ScrollArea className="max-h-[250px]">
                                <div className="overflow-hidden text-start text-black font-medium p-4">
                                  {candidate.summary}
                                </div>
                              </ScrollArea>
                            </CardContent>
                          </Card>
                        )}
                        <Card className="bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <FileText className="h-5 w-5" />
                              Resume/CV
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="aspect-[8.5/11] bg-background/95 rounded-lg flex items-center justify-center relative overflow-hidden shadow-inner">
                              {resumeUrl ? (
                                <>
                                  {isCVLoading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-background/95 z-10">
                                      <div className="text-center text-muted-foreground">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                                        <p>Loading CV... {currentViewerIndex > 0 && `(trying alternative viewer)`}</p>
                                      </div>
                                    </div>
                                  )}
                                  {hasError ? (
                                    <div className="text-center text-muted-foreground p-4">
                                      <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                      <p className="mb-2">Failed to load CV</p>
                                      <a
                                        href={resumeUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary hover:underline text-sm"
                                      >
                                        Download CV instead →
                                      </a>
                                    </div>
                                  ) : (
                                    <iframe
                                      key={currentViewerIndex}
                                      src={viewerOptions[currentViewerIndex] || ''}
                                      className="w-full h-full rounded-lg"
                                      title={`${candidate.fullName}'s Resume`}
                                      onLoad={handleCVLoad}
                                      onError={handleCVError}
                                    />
                                  )}
                                </>
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
                    </div>
                  </TabsContent>
                  <TabsContent value="interview">
                    <InterviewResultsTab
                      data={{
                        skills: candidate.skills as unknown as SkillAssessment[],
                      }}
                    />
                  </TabsContent>
                  <TabsContent value="applications">
                    <ApplicationTable
                      data={candidate as ApplicantResponseDTO}
                      onDeleteApplication={handleDataMutation}
                      onEditApplication={handleDataMutation}
                    />
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
