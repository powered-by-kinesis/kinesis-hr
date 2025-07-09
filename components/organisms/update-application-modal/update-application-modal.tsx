'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { ApplicationResponseDTO } from '@/types/application';
import { UpdateApplicationRequestDTO } from '@/types/application/UpdateApplicationRequestDTO';
import { applicationRepository } from '@/repositories/application-repository';
import { StageOptions, Stage } from '@/constants/enums/stage';

interface UpdateApplicationModalProps {
    onEditApplication?: () => void;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    application?: ApplicationResponseDTO;
    onClose?: () => void;
}

export function UpdateApplicationModal({
    isOpen,
    onOpenChange,
    application,
    onClose,
    onEditApplication,
}: UpdateApplicationModalProps) {
    const [isLoading, setIsLoading] = React.useState(false);

    const form = useForm<UpdateApplicationRequestDTO>({
        resolver: zodResolver(UpdateApplicationRequestDTO),
        defaultValues: {
            currentStage: Stage.APPLIED,
            notes: '',
        },
    });

    React.useEffect(() => {
        if (application) {
            form.reset({
                currentStage: application.currentStage,
                notes: application.notes || '',
            });
        } else {
            form.reset({
                currentStage: Stage.APPLIED,
                notes: '',
            });
        }
    }, [application, form]);

    const onSubmit = async (values: UpdateApplicationRequestDTO) => {
        if (!application) return;

        try {
            setIsLoading(true);
            await applicationRepository.updateApplication(application.id, {
                currentStage: values.currentStage,
                notes: values.notes ?? undefined,
            });
            toast.success('Application updated successfully!');
            onOpenChange(false);
            onEditApplication?.();
        } catch (error) {
            console.error('Error updating application:', error);
            toast.error('Failed to update application. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        onOpenChange(false);
        form.reset();
        onClose?.();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px] bg-card">
                <DialogHeader>
                    <DialogTitle>Update Application Status</DialogTitle>
                    <DialogDescription>
                        Change the current stage and add notes for this application.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="currentStage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Current Stage *</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className='cursor-pointer'>
                                                <SelectValue placeholder="Select a stage" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className='cursor-pointer'>
                                            {StageOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value} className='cursor-pointer hover:bg-muted'>
                                                    {option.label}
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
                            name="notes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Notes</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Add any relevant notes here..."
                                            className="min-h-[100px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex items-center justify-end space-x-2 pt-4">
                            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading} className='cursor-pointer'>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading} className='cursor-pointer'>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Update Status
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
