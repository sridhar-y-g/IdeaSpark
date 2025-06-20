'use server';

/**
 * @fileOverview This file defines the ideaChatbot flow, which allows users to ask questions about specific ideas.
 *
 * - ideaChatbot - An async function that takes an IdeaChatbotInput and returns an IdeaChatbotOutput.
 * - IdeaChatbotInput - The input type for the ideaChatbot function.
 * - IdeaChatbotOutput - The output type for the ideaChatbot function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdeaChatbotInputSchema = z.object({
  ideaTitle: z.string().describe('The title of the idea.'),
  ideaDescription: z.string().describe('The description of the idea.'),
  userQuestion: z.string().describe('The user question about the idea.'),
});

export type IdeaChatbotInput = z.infer<typeof IdeaChatbotInputSchema>;

const IdeaChatbotOutputSchema = z.object({
  answer: z.string().describe('The chatbot answer to the user question.'),
});

export type IdeaChatbotOutput = z.infer<typeof IdeaChatbotOutputSchema>;

export async function ideaChatbot(input: IdeaChatbotInput): Promise<IdeaChatbotOutput> {
  return ideaChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'ideaChatbotPrompt',
  input: {schema: IdeaChatbotInputSchema},
  output: {schema: IdeaChatbotOutputSchema},
  prompt: `You are a chatbot that answers questions about ideas.

  Idea Title: {{{ideaTitle}}}
  Idea Description: {{{ideaDescription}}}

  Answer the following question about the idea:
  {{{userQuestion}}}
  `,
});

const ideaChatbotFlow = ai.defineFlow(
  {
    name: 'ideaChatbotFlow',
    inputSchema: IdeaChatbotInputSchema,
    outputSchema: IdeaChatbotOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
