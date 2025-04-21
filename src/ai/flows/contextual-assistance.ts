'use server';
/**
 * @fileOverview A contextual assistance AI agent that provides additional information about a topic discussed in the chat.
 *
 * - contextualAssistance - A function that handles the contextual assistance process.
 * - ContextualAssistanceInput - The input type for the contextualAssistance function.
 * - ContextualAssistanceOutput - The return type for the contextualAssistance function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const ContextualAssistanceInputSchema = z.object({
  topic: z.string().describe('The topic for which to provide additional information.'),
});
export type ContextualAssistanceInput = z.infer<typeof ContextualAssistanceInputSchema>;

const ContextualAssistanceOutputSchema = z.object({
  information: z.string().describe('Additional information about the topic.'),
});
export type ContextualAssistanceOutput = z.infer<typeof ContextualAssistanceOutputSchema>;

export async function contextualAssistance(input: ContextualAssistanceInput): Promise<ContextualAssistanceOutput> {
  return contextualAssistanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contextualAssistancePrompt',
  input: {
    schema: z.object({
      topic: z.string().describe('The topic for which to provide additional information.'),
    }),
  },
  output: {
    schema: z.object({
      information: z.string().describe('Additional information about the topic.'),
    }),
  },
  prompt: `You are a helpful assistant that provides additional information about a given topic.\n\nTopic: {{{topic}}}\n\nProvide additional information about the topic.`,
});

const contextualAssistanceFlow = ai.defineFlow<
  typeof ContextualAssistanceInputSchema,
  typeof ContextualAssistanceOutputSchema
>({
  name: 'contextualAssistanceFlow',
  inputSchema: ContextualAssistanceInputSchema,
  outputSchema: ContextualAssistanceOutputSchema,
}, async input => {
  const {output} = await prompt(input);
  return output!;
});
