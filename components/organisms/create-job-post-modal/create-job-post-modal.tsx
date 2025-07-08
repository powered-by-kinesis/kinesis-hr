'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Currency, CurrencyOptions } from '@/constants/enums/currency';
import { SalaryType, SalaryTypeOptions } from '@/constants/enums/salary-type';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { CreateJobPostRequestDTO, JobPostResponseDTO } from '@/types/job-post';
import { jobPostRepository } from '@/repositories';
import { EMPLOYMENT_TYPE_OPTIONS, EmploymentType } from '@/constants/enums/employment-type';
import { JOB_STATUS_OPTIONS, JobStatus } from '@/constants/enums/job-status';

interface JobPostModalProps {
  onJobPostCreated?: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  jobPost?: JobPostResponseDTO;
  onClose?: () => void;
}

export function JobPostModal({ onJobPostCreated, isOpen, onOpenChange, jobPost, onClose }: JobPostModalProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [step, setStep] = React.useState(1);
  const isEditMode = !!jobPost;

  const form = useForm<CreateJobPostRequestDTO>({
    resolver: zodResolver(CreateJobPostRequestDTO),
    defaultValues: {
      title: '',
      description: '',
      location: '',
      department: '',
      employmentType: EmploymentType.FULL_TIME,
      status: JobStatus.PUBLISHED,
      salaryMin: 0,
      salaryMax: 0,
      currency: Currency.IDR,
      salaryType: SalaryType.MONTHLY,
    },
  });

  // Reset form when jobPost changes
  React.useEffect(() => {
    if (jobPost) {
      form.reset({
        title: jobPost.title || '',
        description: jobPost.description || '',
        location: jobPost.location || '',
        department: jobPost.department || '',
        employmentType: jobPost.employmentType,
        status: jobPost.status,
        salaryMin: Number(jobPost.salaryMin || 0),
        salaryMax: Number(jobPost.salaryMax || 0),
        currency: jobPost.currency || Currency.IDR,
        salaryType: jobPost.salaryType || SalaryType.MONTHLY,
      });
    } else {
      form.reset({
        title: '',
        description: '',
        location: '',
        department: '',
        employmentType: EmploymentType.FULL_TIME,
        status: JobStatus.PUBLISHED,
        salaryMin: 0,
        salaryMax: 0,
        currency: Currency.IDR,
        salaryType: SalaryType.MONTHLY,
      });
    }
  }, [jobPost, form]);

  const onSubmit = async (values: CreateJobPostRequestDTO) => {
    try {
      setIsLoading(true);
      if (isEditMode && jobPost) {
        await jobPostRepository.updateJobPost(jobPost.id, values);
        toast.success('Job post updated successfully!');
      } else {
        await jobPostRepository.createJobPost(values);
        toast.success('Job post created successfully!');
      }
      onOpenChange(false);
      setStep(1); // Reset step
      onJobPostCreated?.();
    } catch (error) {
      console.error('Error saving job post:', error);
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} job post. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent form submission
    // Validate only the fields in step 1
    const step1Fields = ['title', 'description', 'location', 'employmentType', 'status', 'department'] as const;
    const result = await form.trigger(step1Fields);
    if (result) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleClose = () => {
    onOpenChange(false);
    setStep(1); // Reset step when closing
    form.reset();
    onClose?.();
  };

  const handleSalaryMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // If input is empty, set to 0
    if (!inputValue) {
      form.setValue('salaryMin', 0);
      return;
    }

    const value = parseFloat(inputValue);
    if (isNaN(value) || value < 0) {
      form.setValue('salaryMin', 0);
    } else {
      form.setValue('salaryMin', value);
    }
  };

  const handleSalaryMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // If input is empty, set to 0
    if (!inputValue) {
      form.setValue('salaryMax', 0);
      return;
    }

    const value = parseFloat(inputValue);
    if (isNaN(value) || value < 0) {
      form.setValue('salaryMax', 0);
    } else {
      form.setValue('salaryMax', value);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] bg-card">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Edit Job Post' : 'Create New Job Post'}</DialogTitle>
          <DialogDescription>
            {step === 1 ? 'Fill in the basic job details.' : 'Set the salary information.'}
          </DialogDescription>
        </DialogHeader>

        {/* Step Indicator */}
        <div className="mb-6 flex items-center justify-center space-x-2">
          <div className={`h-2 w-2 rounded-full ${step === 1 ? 'bg-blue-600' : 'bg-gray-300'}`} />
          <div className={`h-2 w-2 rounded-full ${step === 2 ? 'bg-blue-600' : 'bg-gray-300'}`} />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {step === 1 ? (
              // Step 1: Job Details
              <>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Senior Frontend Developer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Department *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Engineering" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the role, responsibilities, and requirements..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Jakarta, Indonesia / Remote" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="employmentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Employment Type *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {EMPLOYMENT_TYPE_OPTIONS.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {JOB_STATUS_OPTIONS.map((status) => (
                              <SelectItem key={status.value} value={status.value}>
                                {status.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            ) : (
              // Step 2: Salary Details
              <>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Currency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[200px] overflow-y-auto">
                            {CurrencyOptions.map((currency) => (
                              <SelectItem key={currency.value} value={currency.value}>
                                {currency.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="salaryType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Salary Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select salary type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {SalaryTypeOptions.map((salaryType) => (
                              <SelectItem key={salaryType.value} value={salaryType.value}>
                                {salaryType.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="salaryMin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Salary</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g. 1000000"
                            value={field.value === 0 ? '' : field.value}
                            onChange={handleSalaryMinChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="salaryMax"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Salary</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g. 5000000"
                            value={field.value === 0 ? '' : field.value}
                            onChange={handleSalaryMaxChange}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={step === 1 ? handleClose : handleBack}
                disabled={isLoading}
              >
                {step === 1 ? 'Cancel' : 'Back'}
              </Button>
              {step === 1 ? (
                <Button type="button" onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button type="submit" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isEditMode ? 'Update Job Post' : 'Create Job Post'}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
