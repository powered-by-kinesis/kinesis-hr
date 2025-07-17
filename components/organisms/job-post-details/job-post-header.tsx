import { Badge } from '@/components/ui/badge';
import { CardTitle } from '@/components/ui/card';
import { Briefcase, Clock, MapPin } from 'lucide-react';
import { EmploymentType } from '@/constants/enums/employment-type';
import { EmploymentTypeBadge } from '@/components/molecules/badge';

// Reusable component for displaying an icon-prefixed piece of information.
const InfoItem = ({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) => (
  <div className="flex items-center gap-2 text-muted-foreground">
    {icon}
    <span>{children}</span>
  </div>
);

// Defines the props for the Job Post Header component.
interface JobPostHeaderProps {
  title: string;
  department?: string | null;
  location?: string | null;
  employmentType: EmploymentType;
  postedDate: string;
}

/**
 * Renders a visually striking header for a job post details page.
 * It includes the job title, department, and key metadata like location and post date.
 */
export const JobPostHeader = ({
  title,
  department,
  location,
  employmentType,
  postedDate,
}: JobPostHeaderProps) => {
  return (
    <div className="rounded-xl bg-card dark:from-gray-900/80 dark:via-gray-900 dark:to-black/80 p-8 shadow-sm border border-border/50">
      <div className="space-y-4">
        {department && (
          <Badge variant="outline" className="text-primary border-primary/50 font-medium">
            {department}
          </Badge>
        )}
        <CardTitle className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          {title}
        </CardTitle>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <InfoItem icon={<Briefcase className="h-4 w-4" />}>
            <EmploymentTypeBadge employmentType={employmentType} />
          </InfoItem>
          {location && <InfoItem icon={<MapPin className="h-4 w-4" />}>{location}</InfoItem>}
          <InfoItem icon={<Clock className="h-4 w-4" />}>Posted {postedDate}</InfoItem>
        </div>
      </div>
    </div>
  );
};
