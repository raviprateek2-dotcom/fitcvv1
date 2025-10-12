'use client';

import { suggestResumeImprovements } from '@/app/actions/ai';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Sparkles } from 'lucide-react';
import React, { useState } from 'react';

interface AIContentDialogProps {
  sectionName: string;
  currentContent: string;
  jobDescription?: string;
  onApply: (newContent: string) => void;
}

type SuggestionResult = {
  improvedContent: string;
  reasoning: string;
};

export default function AIContentDialog({ sectionName, currentContent, jobDescription, onApply }: AIContentDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<SuggestionResult | null>(null);
  const { toast } = useToast();

  const handleGetSuggestion = async () => {
    setIsLoading(true);
    setSuggestion(null);
    try {
      const result = await suggestResumeImprovements({
        resumeSection: currentContent,
        jobDescription,
      });

      if (result.success && result.data) {
        setSuggestion(result.data);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error || 'Failed to get AI suggestions.',
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
    if (suggestion) {
      onApply(suggestion.improvedContent);
      setOpen(false);
    }
  };
  
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      // Reset state when closing
      setSuggestion(null);
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="mt-2">
          <Sparkles className="mr-2 h-4 w-4 text-yellow-500" />
          AI Suggestion
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle className="font-headline flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            AI Suggestions for <span className="text-primary">{sectionName}</span>
          </DialogTitle>
          <DialogDescription>Let our AI help you improve this section.</DialogDescription>
        </DialogHeader>
        
        {!suggestion && !isLoading && (
            <div className="text-center py-10">
                <p className="mb-4 text-muted-foreground">Click the button below to generate AI-powered improvements for your content.</p>
                <Button onClick={handleGetSuggestion}>Generate Suggestion</Button>
            </div>
        )}

        {isLoading && <LoadingState />}

        {suggestion && (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
            <div>
              <h3 className="font-semibold mb-2">Suggested Improvement:</h3>
              <div className="p-3 bg-secondary rounded-md text-sm whitespace-pre-wrap">{suggestion.improvedContent}</div>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">Reasoning:</h3>
              <p className="p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-900">{suggestion.reasoning}</p>
            </div>
          </div>
        )}

        {suggestion && !isLoading && (
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleApply}>Apply Suggestion</Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

const LoadingState = () => (
    <div className="space-y-4 py-4">
        <div>
            <h3 className="font-semibold mb-2">Suggested Improvement:</h3>
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </div>
        </div>
        <Separator />
        <div>
            <h3 className="font-semibold mb-2">Reasoning:</h3>
            <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
            </div>
        </div>
    </div>
);
