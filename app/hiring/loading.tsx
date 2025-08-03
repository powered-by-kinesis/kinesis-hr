import { HiringDashboardSkeleton } from '@/components/organisms/hiring-dashboard-skeleton';
import { AppSidebar } from '@/components/organisms/app-sidebar';
import { SiteHeader } from '@/components/organisms/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AIAssistantSidebar } from '@/components/organisms/ai-assistant-sidebar';

export default function HiringLoading() {
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
              <HiringDashboardSkeleton />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>

      <AIAssistantSidebar />
    </div>
  );
}
