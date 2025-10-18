
'use server';

/**
 * @fileOverview Provides AI-powered avatar image generation.
 *
 * - generateAvatar - A function that generates an avatar image from a text prompt.
 * - GenerateAvatarInput - The input type for the generateAvatar function.
 * - GenerateAvatarOutput - The return type for the generateAvatar function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateAvatarInputSchema = z.object({
  prompt: z.string().describe('A descriptive prompt for the avatar image, e.g., "a friendly software engineer, digital art style".'),
});
export type GenerateAvatarInput = z.infer<typeof GenerateAvatarInputSchema>;

const GenerateAvatarOutputSchema = z.object({
  imageDataUri: z.string().describe("The generated avatar image as a data URI, including a MIME type and Base64 encoding. Format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type GenerateAvatarOutput = z.infer<typeof GenerateAvatarOutputSchema>;

export async function generateAvatar(input: GenerateAvatarInput): Promise<GenerateAvatarOutput> {
  return generateAvatarFlow(input);
}

const generateAvatarFlow = ai.defineFlow(
  {
    name: 'generateAvatarFlow',
    inputSchema: GenerateAvatarInputSchema,
    outputSchema: GenerateAvatarOutputSchema,
  },
  async (input) => {
    // Use Imagen 4 for high-quality image generation
    const { media } = await ai.generate({
      model: 'googleai/imagen-4.0-fast-generate-001',
      prompt: `Generate a professional, high-quality circular avatar for a resume application. The subject should be centered and forward-facing. Style: modern, clean, digital illustration. Do not include any text. Prompt: "${input.prompt}"`,
      config: {
        // Requesting a square aspect ratio for easier client-side handling
        aspectRatio: '1:1'
      }
    });

    if (!media.url) {
      throw new Error('Image generation failed to produce an output.');
    }
    
    // The 'url' from Imagen is already a data URI string
    return { imageDataUri: media.url };
  }
);
