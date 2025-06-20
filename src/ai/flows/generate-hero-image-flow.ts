
'use server';
/**
 * @fileOverview A Genkit flow to generate a hero image.
 *
 * - generateHeroImage - A function that generates an image suitable for a hero banner.
 * - GenerateHeroImageInput - The input type (currently empty, prompt is fixed).
 * - GenerateHeroImageOutput - The return type, containing the image data URI.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input schema (can be extended if prompt needs to be dynamic)
const GenerateHeroImageInputSchema = z.object({
  // Example: prompt: z.string().optional().describe('Optional custom prompt for the image.')
});
export type GenerateHeroImageInput = z.infer<typeof GenerateHeroImageInputSchema>;

const GenerateHeroImageOutputSchema = z.object({
  imageDataUri: z.string().describe("The generated image as a data URI (e.g., 'data:image/png;base64,...')."),
});
export type GenerateHeroImageOutput = z.infer<typeof GenerateHeroImageOutputSchema>;

export async function generateHeroImage(input?: GenerateHeroImageInput): Promise<GenerateHeroImageOutput> {
  return generateHeroImageFlow(input || {});
}

const generateHeroImageFlow = ai.defineFlow(
  {
    name: 'generateHeroImageFlow',
    inputSchema: GenerateHeroImageInputSchema,
    outputSchema: GenerateHeroImageOutputSchema,
  },
  async (input) => {
    const promptText = "A vibrant and abstract representation of ideas sparking and connecting. Themes of innovation, creativity, and technology. Suitable for a website hero banner named 'IdeaSpark'. Digital art style, colorful, energetic, optimistic, high resolution.";

    try {
      const {media} = await ai.generate({
        model: 'googleai/gemini-2.0-flash-exp', // Specific model for image generation
        prompt: promptText,
        config: {
          responseModalities: ['TEXT', 'IMAGE'], // Must include IMAGE
        },
      });

      if (media && media.url) {
        return { imageDataUri: media.url };
      } else {
        throw new Error('Image generation did not return a media URL.');
      }
    } catch (error) {
      console.error('Error generating hero image:', error);
      // Fallback or rethrow, depending on desired error handling
      // For now, let's throw to indicate failure
      throw new Error('Failed to generate hero image.');
    }
  }
);
