
'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { generateVideo } from '@/app/actions/ai-video-generator';
import { Loader2, Sparkles, Video, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function VideoPitchGenerator() {
  const [pitchScript, setPitchScript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [videoDataUri, setVideoDataUri] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerateVideo = async () => {
    if (!pitchScript) {
      toast({
        variant: 'destructive',
        title: 'Script is Required',
        description: 'Please enter a script for your video pitch.',
      });
      return;
    }

    setIsLoading(true);
    setVideoDataUri(null);

    try {
      const response = await generateVideo({ prompt: pitchScript });
      if (response.success && response.data) {
        setVideoDataUri(response.data.videoDataUri);
        toast({ title: 'Video Generated!', description: 'Your video pitch is ready.' });
      } else {
        toast({
          variant: 'destructive',
          title: 'Video Generation Failed',
          description: response.error || 'An unexpected error occurred.',
        });
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
        <Card variant='neuro' className="bg-background">
            <CardHeader>
                <CardTitle className="text-2xl font-headline font-bold flex items-center gap-2">
                    <Video className="text-primary"/>
                    AI Video Pitch Generator
                </CardTitle>
                <CardDescription>
                    Turn your elevator pitch into a short video to practice your delivery and presence.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="space-y-2">
                    <Label htmlFor="pitch-script" className="font-semibold">Your Pitch Script:</Label>
                    <Textarea
                        id="pitch-script"
                        value={pitchScript}
                        onChange={(e) => setPitchScript(e.target.value)}
                        placeholder="Write a short script (2-3 sentences) for your video pitch here..."
                        rows={4}
                        disabled={isLoading}
                    />
                 </div>
                 <Button onClick={handleGenerateVideo} disabled={isLoading} className="w-full">
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    {isLoading ? 'Generating Video...' : 'Generate Video Pitch'}
                 </Button>
            </CardContent>

            <AnimatePresence>
                {(isLoading || videoDataUri) && (
                     <CardContent>
                        <motion.div
                            className="w-full space-y-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                        >
                            <div className="w-full aspect-video bg-secondary rounded-lg flex items-center justify-center overflow-hidden">
                                {isLoading ? (
                                    <div className="text-center text-muted-foreground">
                                        <Bot className="h-12 w-12 mx-auto animate-pulse" />
                                        <p className="mt-4 font-semibold">Generating your video...</p>
                                        <p className="text-sm">This may take up to a minute.</p>
                                    </div>
                                ) : videoDataUri ? (
                                    <video src={videoDataUri} controls autoPlay className="w-full h-full object-contain" />
                                ) : null}
                            </div>
                        </motion.div>
                     </CardContent>
                )}
            </AnimatePresence>
        </Card>
    </section>
  );
}
