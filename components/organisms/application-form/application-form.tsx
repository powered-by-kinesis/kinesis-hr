'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { CreateApplicationRequestDTO } from '@/types/application';
import { JobPostResponseDTO } from '@/types/job-post';
import { JobStatus } from '@/constants/enums/job-status';
import { JOB_STATUS_LABELS } from '@/constants/enums/job-status';

interface ApplicationFormProps {
  jobPost: JobPostResponseDTO;
}

export function ApplicationForm({ jobPost }: ApplicationFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  // Initialize form with react-hook-form and Zod validation
  const form = useForm<CreateApplicationRequestDTO>({
    resolver: zodResolver(CreateApplicationRequestDTO),
    defaultValues: {
      jobPostId: jobPost.id,
      fullName: '',
      email: '',
      phone: '',
      resumeUrl: '',
      expectedSalary: '',
      notes: '',
    },
  });

  // Handle form submission
  const onSubmit = async (values: CreateApplicationRequestDTO) => {
    try {
      setIsLoading(true);

      // Submit application to API
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit application: ${response.status}`);
      }

      // Show success message
      toast.success('Application submitted successfully!');
      setIsSubmitted(true);

      // Reset form
      form.reset();
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Show success message if submitted
  if (isSubmitted) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600">Application Submitted!</CardTitle>
          <CardDescription>
            Thank you for your interest. We&apos;ll review your application and get back to you
            soon.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" className="w-full" onClick={() => setIsSubmitted(false)}>
            Submit Another Application
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Show form if job is not active
  if (jobPost.status !== JobStatus.PUBLISHED) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Application Not Available</CardTitle>
          <CardDescription>
            This job post is currently {JOB_STATUS_LABELS[jobPost.status as JobStatus]}.
            Applications are not being accepted at this time.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Apply for this Position</CardTitle>
        <CardDescription>Fill out the form below to submit your application.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="your.email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="+62 812 3456 7890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Resume URL */}
            <FormField
              control={form.control}
              name="resumeUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resume/CV URL</FormLabel>
                  <FormControl>
                    <Input type="url" placeholder="https://drive.google.com/..." {...field} />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">
                    Share a link to your resume (Google Drive, Dropbox, etc.)
                  </p>
                </FormItem>
              )}
            />

            {/* Expected Salary */}
            <FormField
              control={form.control}
              name="expectedSalary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expected Salary *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. IDR 10,000,000 - 15,000,000 per month" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Letter / Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Send className="mr-2 h-4 w-4" />
              Submit Application
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              By submitting this application, you agree to our terms and conditions.
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
