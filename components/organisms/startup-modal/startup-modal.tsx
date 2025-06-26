'use client';

import * as React from 'react';
import { StepOne } from './step-one';
import { StepTwo } from './step-two';
import { useState } from 'react';
import { toast } from 'sonner';
import { ContextResponseDTO } from '@/types/context/ContextResponseDTO';
import { Loading } from '@/components/molecules/loading';

export function StartupModal({
  isOpen,
  onOpenChange,
  onComplete,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (context: ContextResponseDTO) => void;
}) {
  const [step, setStep] = useState(1);
  const [payloadData, setPayloadData] = useState({
    jobDescription: '',
    localLanguage: 'english',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleStepChange = () => {
    setStep(step + 1);
  };

  const handleStepBack = () => {
    if (step === 1) {
      onOpenChange(false);
    } else {
      setStep(step - 1);
    }
  };

  const handleComplete = async (documentIds: number[]) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/contexts', {
        method: 'POST',
        body: JSON.stringify({
          documentIds,
          ...payloadData,
        }),
      });
      const data = await response.json();

      onOpenChange(false);
      onComplete(data.data);
    } catch (error) {
      console.error('Error creating context:', error);
      toast.error('Failed to create context. Please try again.');
      return;
    } finally {
      setPayloadData({ jobDescription: '', localLanguage: 'english' });
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (step === 1) {
    return (
      <StepOne
        onNext={handleStepChange}
        onBack={handleStepBack}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        payloadData={payloadData}
        setPayloadData={setPayloadData}
      />
    );
  } else if (step === 2) {
    return (
      <StepTwo
        onNext={handleComplete}
        onBack={handleStepBack}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      />
    );
  }

  return null;
}
