'use client';

import { AppSidebar } from "@/components/organisms/app-sidebar";
import { SiteHeader } from "@/components/organisms/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"; // Added CardDescription
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { interviewRepository } from "@/repositories/interview-repository";
import { ApplicantResponseDTO } from "@/types/applicant";
import { Loading } from "@/components/molecules/loading";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { InterviewResponseDTO } from "@/types/interview";
import { AiInterviewerTable } from "@/components/organisms/ai-interviewer-table";
import { InviteApplicantModal } from "@/components/organisms/interview-modal/invite-applicant-modal";

const DetailInterviewPage = () => {
    const params = useParams();
    const interviewId = params.id as string;

    const [applicantsForTable, setApplicantsForTable] = useState<ApplicantResponseDTO[]>([]);
    const [interviewData, setInterviewData] = useState<InterviewResponseDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch the specific interview including associated applicants and their applications
                const interview = await interviewRepository.getInterviewById(parseInt(interviewId));
                setInterviewData(interview);

                // Extract applicants directly from the interview object using the interview invitations
                const applicants = interview.invitations?.map(invitation => invitation.applicant) || [];

                // Process applicant data for the chart
                const statusCounts: { [key: string]: number } = {
                    "Taken Interview": 0,
                    "Yet to Take Interview": 0,
                };
                applicants.forEach(applicant => {
                    applicant.applications?.forEach(app => {
                        const stage = app.currentStage;
                        if (stage === "APPLIED" || stage === "AI_SCREENING") {
                            statusCounts["Yet to Take Interview"]++;
                        } else {
                            statusCounts["Taken Interview"]++;
                        }
                    });
                });

                const takenCount = statusCounts["Taken Interview"];
                const yetToTakeCount = statusCounts["Yet to Take Interview"];

                setApplicantsForTable(applicants);

            } catch (err) {
                console.error("Error fetching data:", err);
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        if (interviewId) {
            fetchData();
        }
    }, [interviewId]);

    const handleInviteCandidate = () => {
        setIsInviteModalOpen(true);
    };

    const handleInviteSuccess = () => {
        // Optionally re-fetch data or update UI after successful invitation
        // For now, just close the modal
        setIsInviteModalOpen(false);
    };

    return (
        <div className="relative m-0 p-0">
            <SidebarProvider
                style={
                    {
                        '--sidebar-width': 'calc(var(--spacing) * 72)',
                        '--header-height': 'calc(var(--spacing) * 12)',
                    } as React.CSSProperties
                }
            >
                <AppSidebar variant="inset" />
                <SidebarInset className="md:peer-data-[variant=inset]:m-0">
                    <SiteHeader />
                    <div className="flex flex-1 flex-col">
                        <div className="@container/main flex flex-1 flex-col gap-2">
                            {/* Main content with right margin to accommodate AI Assistant */}
                            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 mr-96">
                                <div className="px-4 lg:px-6">
                                    {loading && interviewData === null ? (
                                        <div className="flex items-center justify-center py-12">
                                            <Loading />
                                        </div>
                                    ) : (
                                        <>
                                            <div className="mb-6 flex justify-between">
                                                <Breadcrumb>
                                                    <BreadcrumbList>
                                                        <BreadcrumbItem>
                                                            <BreadcrumbLink href="/ai-interviewer">AI Interviewer</BreadcrumbLink>
                                                        </BreadcrumbItem>
                                                        <BreadcrumbSeparator />
                                                        <BreadcrumbItem>
                                                            <BreadcrumbPage>{interviewData?.interviewName}</BreadcrumbPage>
                                                        </BreadcrumbItem>
                                                    </BreadcrumbList>
                                                </Breadcrumb>
                                                <Button onClick={handleInviteCandidate}>Invite Applicant</Button>
                                            </div>

                                            <div className="mb-6 *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
                                                <Card className="@container/card">
                                                    <CardHeader>
                                                        <CardDescription>Applied</CardDescription>
                                                        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                                                            $1,250.00
                                                        </CardTitle>
                                                    </CardHeader>
                                                    <CardFooter className="flex-col items-start gap-1.5 text-sm">
                                                        <div className="line-clamp-1 flex gap-2 font-medium">
                                                            Trending up this month
                                                        </div>
                                                        <div className="text-muted-foreground">
                                                            Visitors for the last 6 months
                                                        </div>
                                                    </CardFooter>
                                                </Card>
                                            </div>

                                            <AiInterviewerTable data={interviewData?.invitations || []} />
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                </SidebarInset>
            </SidebarProvider>
            <InviteApplicantModal
                isOpen={isInviteModalOpen}
                onClose={() => setIsInviteModalOpen(false)}
                onInviteSuccess={handleInviteSuccess}
                interviewId={interviewId} // Pass interviewId here
            />
        </div>
    );
};

export default DetailInterviewPage;
