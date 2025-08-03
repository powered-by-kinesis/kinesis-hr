'use client';

import * as React from 'react';
import { Container } from '@/components/atoms/container';
import { Text } from '@/components/atoms/text';
import { Card } from '@/components/ui/card';
import { Alert } from '@/components/ui/alert';
import { Input } from '@/components/atoms/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Footer } from '@/components/organisms/footer';
import { Logo } from '@/components/atoms/logo';
import { User, Mail } from 'lucide-react';
import Link from 'next/link';
import { CurrentStageBadge } from '@/components/molecules/badge';
import { Stage } from '@/constants/enums/stage';

interface Application {
  id: number;
  currentStage: Stage;
  jobPost: {
    title: string;
    id: number;
  };
}

interface Applicant {
  id: number;
  fullName: string;
  email: string;
  appliedAt: string;
  applications: Application[];
}

export default function ApplicantAnnouncementPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [applicant, setApplicant] = useState<Applicant | null>(null);

  const handleCheckStatus = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/applicants/check?email=${encodeURIComponent(email)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to check status');
      }

      setApplicant(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Data not found. Please contact the HR Manager');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col justify-between w-full">
      <div className="flex justify-start items-center px-6 py-6 lg:px-8">
        <Logo />
      </div>
      <Container className="py-8 max-w-3xl mx-auto flex flex-col justify-center w-full">
        <div className="space-y-4">
          <h1 className="text-center font-bold md:text-4xl text-2xl">Check Application Status</h1>
          <p className="text-center text-muted-foreground md:text-lg text-sm">
            Check your application status by entering the email you used to apply
          </p>
        </div>

        <Card className="p-4 md:p-6 mt-10">
          <div className="space-y-4">
            <div className="flex gap-4 justify-center items-center md:flex-row flex-col">
              <Input
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder="Input your email"
                className="flex-1 p-3"
              />
              <Button
                onClick={handleCheckStatus}
                disabled={loading}
                className="cursor-pointer w-full md:w-auto"
              >
                {loading ? 'Checking...' : 'Check Status'}
              </Button>
            </div>
            {error && (
              <Alert variant="destructive">
                <Text variant="small">{error}</Text>
              </Alert>
            )}
            {applicant && (
              <div className="space-y-4 mt-4">
                <Card className="p-4 md:p-6 hover:bg-accent/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="space-y-4 flex-1">
                      {/* Basic Info Section */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-primary" />
                          <Text variant="body" className="font-semibold">
                            {applicant.fullName}
                          </Text>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <Text variant="small" className="text-muted-foreground">
                            {applicant.email}
                          </Text>
                        </div>
                      </div>

                      {/* Applications Section */}
                      <div className="space-y-3 pt-4 border-t">
                        <Text
                          variant="small"
                          className="font-medium flex items-center justify-center text-muted-foreground"
                        >
                          Applications
                        </Text>
                        <div className="space-y-2">
                          {applicant.applications?.map((app) => (
                            <div key={app.id}>
                              <Link
                                href={`/job-posts/${app.jobPost.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <div className="flex items-center justify-between bg-accent/30 p-2 rounded-md hover:bg-primary/10 transition-colors cursor-pointer">
                                  <Text variant="small" className="font-medium">
                                    {app.jobPost.title}
                                  </Text>
                                  <CurrentStageBadge stage={app.currentStage as Stage} />
                                </div>
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </Card>
      </Container>
      <Footer />
    </main>
  );
}
