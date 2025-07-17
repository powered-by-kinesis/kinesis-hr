import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Banknote, Building2 } from 'lucide-react';
import { JobStatus } from '@/constants/enums/job-status';
import { JobBadge } from '@/components/molecules/badge';

const InfoItem = ({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) => (
  <div className="flex items-center gap-2 text-sm">
    {icon}
    <span>{children}</span>
  </div>
);

interface JobPostContentProps {
  description: string;
  formattedSalary: string | null;
  statusLabel: JobStatus;
}

export const JobPostContent = ({
  description,
  formattedSalary,
  statusLabel,
}: JobPostContentProps) => {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Job Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Salary and Status Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-lg border bg-muted/30 p-4">
          {formattedSalary && (
            <InfoItem icon={<Banknote className="h-5 w-5 text-green-500" />}>
              <span className="font-semibold text-foreground">{formattedSalary}</span>
            </InfoItem>
          )}
          <InfoItem icon={<Building2 className="h-5 w-5 text-muted-foreground" />}>
            <JobBadge status={statusLabel as JobStatus} />
          </InfoItem>
        </div>

        {/* Job Description Section */}
        <div>
          <h3 className="text-xl font-semibold mb-4 border-b pb-2">Full Job Description</h3>
          <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
            {description.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 last:mb-0">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
