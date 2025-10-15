
'use client';

import { writeResumeSection } from '@/app/actions/ai-writer';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Bot, Lightbulb, Sparkles } from 'lucide-react';
import React, { useState } from 'react';

interface AISectionWriterDialogProps {
  sectionName: string;
  jobDescription?: string;
  existingContent?: string;
  onApply: (newContent: string) => void;
  children: React.ReactNode;
}

type GenerationResult = {
  generatedContent: string;
};

export default function AISectionWriterDialog({ sectionName, jobDescription, existingContent, onApply, children }: AISectionWriterDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!jobDescription) {
        toast({
            variant: 'destructive',
            title: 'Job Description Required',
            description: 'Please paste the job description first to get tailored AI content.',
        });
        return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const response = await writeResumeSection({
        sectionToGenerate: sectionName,
        jobDescription,
        existingContent,
      });

      if (response.success && response.data) {
        setResult(response.data);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: response.error || 'Failed to generate content.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (result) {
      onApply(result.generatedContent);
      setOpen(false);
    }
  };
  
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setResult(null);
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="font-headline flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            AI Writer for <span className="text-primary">{sectionName}</span>
          </DialogTitle>
          <DialogDescription>Let our AI write this section for you based on the job description.</DialogDescription>
        </DialogHeader>
        
        {!result && !isLoading && (
            <div className="text-center py-10">
                <p className="mb-4 text-muted-foreground">Click the button below to generate a draft for this section.</p>
                <Button onClick={handleGenerate}>Generate Content</Button>
            </div>
        )}

        {isLoading && <LoadingState />}

        {result && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
            <div>
              <h3 className="font-semibold mb-2">Generated Content:</h3>
              <div className="p-4 bg-secondary rounded-md text-sm whitespace-pre-wrap font-mono">{result.generatedContent}</div>
            </div>
          </div>
        )}

        {result && !isLoading && (
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleGenerate}>Regenerate</Button>
            <Button onClick={handleApply}>Use This Content</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

const LoadingState = () => (
    <div className="py-10 flex flex-col items-center justify-center text-center">
        <div className="relative mb-4">
            <Bot className="h-16 w-16 text-primary animate-pulse" />
            <Sparkles className="h-6 w-6 text-yellow-400 absolute -top-2 -right-2 animate-ping" />
            <Lightbulb className="h-5 w-5 text-accent absolute bottom-0 -left-2 animate-pulse delay-500" />
        </div>
        <p className="text-lg font-semibold animate-pulse">Our AI is writing...</p>
        <p className="text-muted-foreground mt-1">Crafting content tailored to the job description.</p>
    </div>
);
