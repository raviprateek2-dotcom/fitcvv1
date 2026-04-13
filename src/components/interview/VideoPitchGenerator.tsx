
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
            <CardHeader className="px-4 pt-4 sm:px-6 sm:pt-6">
                <CardTitle className="text-xl sm:text-2xl font-headline font-bold flex items-center gap-2">
                    <Video className="text-primary h-6 w-6 shrink-0" aria-hidden />
                    AI Video Pitch Generator
                </CardTitle>
                <CardDescription className="text-sm sm:text-base leading-relaxed">
                    Turn your elevator pitch into a short video to practice your delivery and presence. On phones, playback uses inline video — use headphones in quiet spaces.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-4 pb-4 sm:px-6 sm:pb-6">
                 <div className="space-y-2">
                    <Label htmlFor="pitch-script" className="font-semibold text-sm">Your pitch script</Label>
                    <Textarea
                        id="pitch-script"
                        value={pitchScript}
                        onChange={(e) => setPitchScript(e.target.value)}
                        placeholder="Write a short script (2-3 sentences) for your video pitch here..."
                        rows={5}
                        disabled={isLoading}
                        className="min-h-[120px] text-base sm:text-sm"
                    />
                 </div>
                 <Button onClick={handleGenerateVideo} disabled={isLoading} className="w-full min-h-[48px] text-base sm:text-sm">
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
                            <div className="w-full aspect-video bg-secondary rounded-lg flex items-center justify-center overflow-hidden pb-[max(0px,env(safe-area-inset-bottom))]">
                                {isLoading ? (
                                    <div className="text-center text-muted-foreground px-4">
                                        <Bot className="h-10 w-10 sm:h-12 sm:w-12 mx-auto animate-pulse motion-reduce:animate-none" aria-hidden />
                                        <p className="mt-4 font-semibold text-sm sm:text-base">Generating your video…</p>
                                        <p className="text-xs sm:text-sm mt-1">This may take up to a minute on mobile data.</p>
                                    </div>
                                ) : videoDataUri ? (
                                    <video
                                      src={videoDataUri}
                                      controls
                                      playsInline
                                      preload="metadata"
                                      className="w-full h-full max-h-[70dvh] object-contain bg-black/5"
                                    />
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
