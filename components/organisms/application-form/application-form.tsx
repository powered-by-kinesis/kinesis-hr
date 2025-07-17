'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2, Send, FileText, XIcon } from 'lucide-react';
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
import { useDocuments } from '@/hooks/use-documents';

interface ApplicationFormProps {
  jobPost: JobPostResponseDTO;
}

export function ApplicationForm({ jobPost }: ApplicationFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { isUploading, supportedTypes, uploadDocuments } = useDocuments();

  // Initialize form with react-hook-form and Zod validation
  const form = useForm<CreateApplicationRequestDTO>({
    resolver: zodResolver(CreateApplicationRequestDTO),
    defaultValues: {
      jobPostId: jobPost.id,
      fullName: '',
      email: '',
      phone: '',
      documentIds: [],
      expectedSalary: '',
      notes: '',
    },
  });

  const handleRemoveFile = (file: File) => {
    setSelectedFiles(selectedFiles.filter((f) => f !== file));
    // Reset documentIds when removing file since we'll need to upload again
    form.setValue('documentIds', []);
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setSelectedFiles([files[0]]); // Only take the first file
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFiles([files[0]]); // Only take the first file
    }
  };

  // Handle form submission
  const onSubmit = async (values: CreateApplicationRequestDTO) => {
    try {
      setIsLoading(true);

      // First upload the CV/Resume if selected
      if (selectedFiles.length === 0) {
        toast.error('Please upload your CV/Resume');
        return;
      }

      const documentIds = await uploadDocuments(selectedFiles);

      if (!documentIds || documentIds.length === 0) {
        toast.error('Failed to upload CV/Resume');
        return;
      }

      const submitData = {
        ...values,
        documentIds,
      };

      // Submit application to API
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          toast.error('You have already applied for this job');
          return;
        }

        throw new Error(responseData.message || 'Failed to submit application');
      }

      // Show success message
      toast.success('Application submitted successfully!');
      setIsSubmitted(true);

      // Reset form and selected files
      form.reset();
      setSelectedFiles([]);
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to submit application. Please try again.',
      );
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Apply for this Position</CardTitle>
        <CardDescription>Fill out the form below to submit your application.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
            {/* Full Name */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem className="w-full">
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
                <FormItem className="w-full">
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
                <FormItem className="w-full">
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="+62 812 3456 7890" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* CV/Resume Upload */}
            <FormItem className="w-full">
              <FormLabel>Resume/CV *</FormLabel>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileInputChange}
                accept={supportedTypes.join(',')}
              />

              <div
                className={`w-full mt-2 border-2 border-dashed rounded-lg p-6 text-center transition-colors
                ${isDragging ? 'border-primary bg-primary/10' : 'border-primary/30'}
                ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={handleBrowseClick}
              >
                <div className="flex flex-col items-center gap-2 w-full">
                  <FileText
                    className={`h-8 w-8 ${isDragging ? 'text-primary' : 'text-primary/70'}`}
                  />
                  <div className="w-full">
                    <p className="text-sm font-medium text-gray-700">Upload CV/Resume</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Drag & drop here, or{' '}
                      <button
                        type="button"
                        className="text-primary hover:underline font-medium cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBrowseClick();
                        }}
                      >
                        browse files
                      </button>
                    </p>
                  </div>
                </div>
              </div>

              {selectedFiles.length > 0 && (
                <div className="w-full mt-2">
                  <ul className="space-y-2 w-full">
                    {selectedFiles.map((file, index) => (
                      <li
                        key={index}
                        className="w-full flex items-center gap-3 p-2 border border-text-foreground rounded-lg text-sm bg-card"
                      >
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <div className="font-medium text-gray-700 break-all" title={file.name}>
                            {file.name}
                          </div>
                          <div className="text-xs text-gray-400">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveFile(file)}
                          className="h-8 w-8 flex-shrink-0"
                        >
                          <XIcon className="w-4 h-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <p className="text-xs text-muted-foreground mt-2">
                Supported formats: PDF, DOC, DOCX (Max 10MB)
              </p>
            </FormItem>

            {/* Expected Salary */}
            <FormField
              control={form.control}
              name="expectedSalary"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Expected Salary *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 10000000" {...field} />
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
                <FormItem className="w-full">
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
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isLoading || isUploading || selectedFiles.length === 0}
            >
              {(isLoading || isUploading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
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
