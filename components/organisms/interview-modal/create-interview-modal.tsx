'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CreateInterviewRequestDTO } from '@/types/interview/CreateInterviewRequestDTO';
import { jobPostRepository } from '@/repositories/job-post-repository';
import { JobPostResponseDTO } from '@/types/job-post';
import { applicantRepository } from '@/repositories/applicant-repository';
import { ApplicantResponseDTO } from '@/types/applicant';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface CreateInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateInterviewRequestDTO) => Promise<void>;
}

export function CreateInterviewModal({ isOpen, onClose, onSubmit }: CreateInterviewModalProps) {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [interviewType, setInterviewType] = React.useState<'new' | 'fromJob'>('new');
  const [jobPosts, setJobPosts] = React.useState<JobPostResponseDTO[]>([]);
  const [isLoadingJobPosts, setIsLoadingJobPosts] = React.useState(true);
  const [applicants, setApplicants] = React.useState<ApplicantResponseDTO[]>([]);
  const [isLoadingApplicants, setIsLoadingApplicants] = React.useState(true);
  const [selectedApplicantIds, setSelectedApplicantIds] = React.useState<number[]>([]);
  const [applicantSearchQuery, setApplicantSearchQuery] = React.useState('');

  const form = useForm<CreateInterviewRequestDTO>({
    resolver: zodResolver(CreateInterviewRequestDTO),
    defaultValues: {
      interviewName: '',
      skills: [
        { name: '', description: '' },
        { name: '', description: '' },
        { name: '', description: '' },
      ],
      customQuestionList: [],
      jobPostId: undefined,
      applicantIds: [],
    },
  });

  React.useEffect(() => {
    const fetchJobPosts = async () => {
      try {
        setIsLoadingJobPosts(true);
        const data = await jobPostRepository.getAllJobPosts();
        setJobPosts(data);
      } catch (error) {
        console.error('Error fetching job posts:', error);
      } finally {
        setIsLoadingJobPosts(false);
      }
    };

    if (isOpen && interviewType === 'fromJob') {
      fetchJobPosts();
    }
  }, [isOpen, interviewType]);

  React.useEffect(() => {
    const fetchApplicants = async () => {
      try {
        setIsLoadingApplicants(true);
        const data = await applicantRepository.getAllApplicants();
        setApplicants(data);
      } catch (error) {
        console.error('Error fetching applicants:', error);
      } finally {
        setIsLoadingApplicants(false);
      }
    };

    if (isOpen && currentStep === 3) {
      // Changed from 2 to 3
      fetchApplicants();
    }
  }, [isOpen, currentStep]);

  React.useEffect(() => {
    if (interviewType === 'new') {
      form.setValue('interviewName', '');
      form.setValue('jobPostId', undefined);
    }
  }, [interviewType, form]);

  const handleApplicantSelection = (applicantId: number, isChecked: boolean) => {
    setSelectedApplicantIds((prev) =>
      isChecked ? [...prev, applicantId] : prev.filter((id) => id !== applicantId),
    );
  };

  const handleSubmit = async (data: CreateInterviewRequestDTO) => {
    if (currentStep !== 4) {
      return;
    }

    try {
      await onSubmit({ ...data, applicantIds: selectedApplicantIds });
      toast.success('Interview created and invitations sent successfully!');
      form.reset();
      onClose();
      setCurrentStep(1);
    } catch (error) {
      console.error('Error creating interview or sending invitations:', error);
      toast.error('Failed to create interview or send invitations.');
    }
  };

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const filteredApplicants = applicants.filter(
    (applicant) =>
      applicant.fullName.toLowerCase().includes(applicantSearchQuery.toLowerCase()) ||
      applicant.email.toLowerCase().includes(applicantSearchQuery.toLowerCase()),
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[825px]">
        <DialogHeader>
          <DialogTitle>Create New Interview (Step {currentStep}/4)</DialogTitle>
          <DialogDescription>
            {currentStep === 1 && 'Select the type of interview to create.'}
            {currentStep === 2 && 'Define skills and custom questions.'}
            {currentStep === 3 && 'Select applicants for the interview.'}
            {currentStep === 4 && 'Review and create the interview.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
            {currentStep === 1 && (
              <div className="space-y-4">
                <FormItem className="space-y-3">
                  <FormLabel>Interview Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value: 'new' | 'fromJob') => setInterviewType(value)}
                      defaultValue={interviewType}
                      className="flex flex-col space-y-1"
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="new" />
                        </FormControl>
                        <FormLabel className="font-normal">Create New Interview</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value="fromJob" />
                        </FormControl>
                        <FormLabel className="font-normal">Create Based on Job List</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
                {interviewType === 'new' && (
                  <FormField
                    control={form.control}
                    name="interviewName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Interview Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Senior Frontend Interview" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                {interviewType === 'fromJob' && (
                  <FormField
                    control={form.control}
                    name="jobPostId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Job Post</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(Number(value));
                            const selectedJob = jobPosts.find((job) => job.id === Number(value));
                            if (selectedJob) {
                              form.setValue('interviewName', selectedJob.title);
                            }
                          }}
                          value={field.value?.toString() || ''}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a job post" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="w-full">
                            {isLoadingJobPosts ? (
                              <SelectItem value="loading" disabled>
                                Loading job posts...
                              </SelectItem>
                            ) : jobPosts.length === 0 ? (
                              <SelectItem value="no-jobs" disabled>
                                No job posts available.
                              </SelectItem>
                            ) : (
                              jobPosts.map((job) => (
                                <SelectItem key={job.id} value={job.id.toString()}>
                                  {job.title}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <FormLabel>Skills</FormLabel>
                {/* Placeholder for dynamic skill input */}
                <p className="text-sm text-muted-foreground">
                  Add skills required for the interview.
                </p>
                {(form.watch('skills') || []).map((skill, index) => (
                  <div key={index} className="flex gap-2">
                    <FormField
                      control={form.control}
                      name={`skills.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Skill Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., React" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`skills.${index}.description`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., State management" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const currentSkills = form.getValues('skills') || [];
                        const newSkills = currentSkills.filter((_, i) => i !== index);
                        form.setValue('skills', newSkills);
                      }}
                      className="self-end"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const currentSkills = form.getValues('skills') || [];
                    form.setValue('skills', [...currentSkills, { name: '', description: '' }]);
                  }}
                >
                  Add Skill
                </Button>

                <FormLabel className="mt-4 block">Custom Questions</FormLabel>
                {/* Placeholder for dynamic custom question input */}
                <p className="text-sm text-muted-foreground">
                  Add custom questions for the interview.
                </p>

                {(form.watch('customQuestionList') || []).map((question, index) => (
                  <div key={index} className="flex gap-2">
                    <FormField
                      control={form.control}
                      name={`customQuestionList.${index}.question`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Question</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Describe a challenging project" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`customQuestionList.${index}.time`}
                      render={({ field }) => (
                        <FormItem className="w-24">
                          <FormLabel>Time (min)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="5"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const currentQuestions = form.getValues('customQuestionList') || [];
                        const newQuestions = currentQuestions.filter((_, i) => i !== index);
                        form.setValue('customQuestionList', newQuestions);
                      }}
                      className="self-end"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const currentQuestions = form.getValues('customQuestionList') || [];
                    form.setValue('customQuestionList', [
                      ...currentQuestions,
                      { question: '', time: 0 },
                    ]);
                  }}
                >
                  Add Question
                </Button>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <FormLabel>Select Applicants</FormLabel>
                <Input
                  placeholder="Search applicants..."
                  value={applicantSearchQuery}
                  onChange={(e) => setApplicantSearchQuery(e.target.value)}
                  className="mb-4"
                />
                {isLoadingApplicants ? (
                  <p>Loading applicants...</p>
                ) : filteredApplicants.length === 0 ? (
                  <p>No applicants available.</p>
                ) : (
                  <div className="grid gap-2 max-h-60 overflow-y-auto">
                    {filteredApplicants.map((applicant) => (
                      <div key={applicant.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`applicant-${applicant.id}`}
                          checked={selectedApplicantIds.includes(applicant.id)}
                          onCheckedChange={(checked) =>
                            handleApplicantSelection(applicant.id, !!checked)
                          }
                        />
                        <label
                          htmlFor={`applicant-${applicant.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {applicant.fullName} ({applicant.email})
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <FormLabel>Review Interview Details</FormLabel>
                <p>Interview Name: {form.watch('interviewName')}</p>
                {form.watch('jobPostId') && (
                  <p>
                    Job Post: {jobPosts.find((job) => job.id === form.watch('jobPostId'))?.title}
                  </p>
                )}
                <p>Selected Applicants:</p>
                <ul>
                  {selectedApplicantIds.map((id) => {
                    const applicant = applicants.find((app) => app.id === id);
                    return (
                      <li key={id}>
                        - {applicant?.fullName} ({applicant?.email})
                      </li>
                    );
                  })}
                </ul>
                <p>Skills:</p>
                <ul>
                  {(form.watch('skills') || []).map((skill, index) => (
                    <li key={index}>
                      - {skill.name}: {skill.description}
                    </li>
                  ))}
                </ul>
                <p>Custom Questions:</p>
                <ul>
                  {(form.watch('customQuestionList') || []).map((question, index) => (
                    <li key={index}>
                      - {question.question} ({question.time} min)
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <DialogFooter>
              {currentStep > 1 && (
                <Button type="button" variant="outline" onClick={handleBack}>
                  Back
                </Button>
              )}
              {currentStep < 4 && (
                <Button type="button" onClick={handleNext}>
                  Next
                </Button>
              )}
              {currentStep === 4 && <Button type="submit">Create Interview</Button>}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
