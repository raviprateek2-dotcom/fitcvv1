
'use server';

/**
 * @fileOverview Provides AI-powered video generation from a text prompt.
 * 
 * - generateVideo - A function that generates a video using the Veo model.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { MediaPart } from 'genkit';

const GenerateVideoInputSchema = z.object({
  prompt: z.string().describe('A descriptive prompt for the video to be generated.'),
});
export type GenerateVideoInput = z.infer<typeof GenerateVideoInputSchema>;

const GenerateVideoOutputSchema = z.object({
  videoDataUri: z.string().describe("The generated video as a data URI, including a MIME type and Base64 encoding. Format: 'data:video/mp4;base64,<encoded_data>'."),
});
export type GenerateVideoOutput = z.infer<typeof GenerateVideoOutputSchema>;


async function downloadVideo(video: MediaPart): Promise<string> {
    const fetch = (await import('node-fetch')).default;
    // The media URL from Veo needs the API key to be appended for access.
    // Ensure GEMINI_API_KEY is available in your environment.
    const videoDownloadResponse = await fetch(
        `${video.media!.url}&key=${process.env.GEMINI_API_KEY}`
    );

    if (!videoDownloadResponse || videoDownloadResponse.status !== 200 || !videoDownloadResponse.body) {
        throw new Error('Failed to fetch generated video from storage.');
    }
    
    // Read the response body as a buffer and convert to base64
    const buffer = await videoDownloadResponse.arrayBuffer();
    return Buffer.from(buffer).toString('base64');
}

const generateVideoFlow = ai.defineFlow(
  {
    name: 'generateVideoFlow',
    inputSchema: GenerateVideoInputSchema,
    outputSchema: GenerateVideoOutputSchema,
  },
  async (input) => {
    let { operation } = await ai.generate({
        model: 'googleai/veo-2.0-generate-001',
        prompt: input.prompt,
        config: {
          durationSeconds: 5,
          aspectRatio: '16:9',
        },
      });
    
      if (!operation) {
        throw new Error('Expected the model to return an operation for video generation.');
      }
    
      // Video generation can take time. Poll the operation status until it's done.
      while (!operation.done) {
        console.log('Waiting for video generation to complete...');
        // Wait for 5 seconds before checking the operation status again.
        await new Promise((resolve) => setTimeout(resolve, 5000));
        operation = await ai.checkOperation(operation);
      }
    
      if (operation.error) {
        throw new Error(`Video generation failed: ${operation.error.message}`);
      }
    
      const video = operation.output?.message?.content.find((p) => !!p.media);
      if (!video) {
        throw new Error('Failed to find the generated video in the operation result.');
      }
      
      const videoBase64 = await downloadVideo(video);

      return { videoDataUri: `data:video/mp4;base64,${videoBase64}` };
  }
);


export async function generateVideo(input: GenerateVideoInput): Promise<GenerateVideoOutput> {
    return generateVideoFlow(input);
}
