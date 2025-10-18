
'use server';

/**
 * @fileOverview Provides AI-powered text-to-speech narration.
 *
 * - aiNarrate - A function that converts text into speech audio.
 * - AiNarrateOutput - The return type for the aiNarrate function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import wav from 'wav';

const AiNarrateOutputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "The generated audio as a data URI, including a MIME type (audio/wav) and Base64 encoding. Format: 'data:audio/wav;base64,<encoded_data>'."
    ),
});
export type AiNarrateOutput = z.infer<typeof AiNarrateOutputSchema>;

export async function aiNarrate(textToSpeak: string): Promise<AiNarrateOutput> {
  return aiNarrateFlow(textToSpeak);
}

// Helper function to convert PCM audio buffer to WAV format as a Base64 string
async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', (d) => {
      bufs.push(d);
    });
    writer.on('end', () => {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const aiNarrateFlow = ai.defineFlow(
  {
    name: 'aiNarrateFlow',
    inputSchema: z.string(),
    outputSchema: AiNarrateOutputSchema,
  },
  async (text) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            // Using a standard, professional voice
            prebuiltVoiceConfig: { voiceName: 'Alloy' },
          },
        },
      },
      prompt: text,
    });

    if (!media || !media.url) {
      throw new Error('Text-to-speech generation failed to produce an output.');
    }

    // The media.url from TTS is a data URI with PCM data. We need to convert it to WAV.
    const pcmAudioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );

    const wavBase64 = await toWav(pcmAudioBuffer);

    return {
      audioDataUri: `data:audio/wav;base64,${wavBase64}`,
    };
  }
);
