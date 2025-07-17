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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UpdateInterviewRequestDTO } from '@/types/interview/UpdateInterviewRequestDTO';
import { InterviewResponseDTO } from '@/types/interview';
import { jobPostRepository } from '@/repositories/job-post-repository';
import { JobPostResponseDTO } from '@/types/job-post';
import { Trash2 } from 'lucide-react';

interface EditInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateInterviewRequestDTO) => void;
  initialData: InterviewResponseDTO;
}

export function EditInterviewModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: EditInterviewModalProps) {
  const [jobPosts, setJobPosts] = React.useState<JobPostResponseDTO[]>([]);
  const [isLoadingJobPosts, setIsLoadingJobPosts] = React.useState(true);

  const form = useForm<UpdateInterviewRequestDTO>({
    resolver: zodResolver(UpdateInterviewRequestDTO),
    defaultValues: {
      interviewName: initialData.interviewName,
      skills: initialData.skills as { name: string; description: string }[],
      customQuestionList: initialData.customQuestionList as { question: string; time: number }[],
      jobPostId: initialData.jobPostId || undefined,
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

    if (isOpen) {
      fetchJobPosts();
    }
  }, [isOpen]);

  const handleSubmit = (data: UpdateInterviewRequestDTO) => {
    onSubmit(data);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[825px]">
        <DialogHeader>
          <DialogTitle>Edit Interview</DialogTitle>
          <DialogDescription>Update the details of your interview.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="grid gap-4 py-4">
            <div className="space-y-4">
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
            </div>

            <div className="space-y-4">
              <FormLabel>Skills</FormLabel>
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

            <DialogFooter>
              <Button type="submit">Update Interview</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
