'use server';

/**
 * @fileOverview Generates smart replies based on the last message received.
 *
 * - generateSmartReplies - A function that generates smart replies.
 * - GenerateSmartRepliesInput - The input type for the generateSmartReplies function.
 * - GenerateSmartRepliesOutput - The return type for the generateSmartReplies function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateSmartRepliesInputSchema = z.object({
  message: z.string().describe('The last message received.'),
});
export type GenerateSmartRepliesInput = z.infer<typeof GenerateSmartRepliesInputSchema>;

const GenerateSmartRepliesOutputSchema = z.object({
  replies: z.array(
    z.string().describe('A suggested smart reply.')
  ).describe('An array of suggested smart replies.')
});
export type GenerateSmartRepliesOutput = z.infer<typeof GenerateSmartRepliesOutputSchema>;

export async function generateSmartReplies(input: GenerateSmartRepliesInput): Promise<GenerateSmartRepliesOutput> {
  return generateSmartRepliesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartRepliesPrompt',
  input: {
    schema: z.object({
      message: z.string().describe('The last message received.'),
    }),
  },
  output: {
    schema: z.object({
      replies: z.array(
        z.string().describe('A suggested smart reply.')
      ).describe('An array of suggested smart replies.')
    }),
  },
  prompt: `You are a helpful chat assistant. Generate three smart replies to the following message:

Message: {{{message}}}

Replies:
`,
});

const generateSmartRepliesFlow = ai.defineFlow<
  typeof GenerateSmartRepliesInputSchema,
  typeof GenerateSmartRepliesOutputSchema
>({
  name: 'generateSmartRepliesFlow',
  inputSchema: GenerateSmartRepliesInputSchema,
  outputSchema: GenerateSmartRepliesOutputSchema,
},
async input => {
  const {output} = await prompt(input);
  return output!;
});
