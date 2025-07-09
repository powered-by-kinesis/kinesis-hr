import * as React from 'react';
import { notFound } from 'next/navigation';

import { AppSidebar } from '@/components/organisms/app-sidebar';
import { SiteHeader } from '@/components/organisms/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AIAssistantSidebar } from '@/components/organisms/ai-assistant-sidebar';
import { applicantRepository } from '@/repositories/applicant-repository';
import { CandidateDetailsClient } from './candidate-details-client';
import { CandidateDetailsSkeleton } from '@/components/organisms/candidate-details-skeleton';


export default async function CandidateDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const candidateData = await applicantRepository.getApplicantById(Number(id));

    if (!candidateData) {
        notFound();
    }

    return (
        <div className="relative min-h-screen bg-background">
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
                            <React.Suspense fallback={<CandidateDetailsSkeleton />}>
                                <CandidateDetailsClient initialCandidate={candidateData} />
                            </React.Suspense>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>

            <AIAssistantSidebar />
        </div>
    );
}
