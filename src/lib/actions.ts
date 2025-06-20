
"use server";

import type { Idea } from './types';
import { IdeaCategory } from './types';
import { z } from 'zod';
import { suggestTags as aiSuggestTags, type SuggestTagsInput, type SuggestTagsOutput } from '@/ai/flows/suggest-tags';
import { ideaChatbot as aiIdeaChatbot, type IdeaChatbotInput, type IdeaChatbotOutput } from '@/ai/flows/idea-chatbot';
import { generateHeroImage as aiGenerateHeroImage, type GenerateHeroImageInput, type GenerateHeroImageOutput } from '@/ai/flows/generate-hero-image-flow';


const ideaFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  description: z.string().min(20, "Description must be at least 20 characters").max(5000),
  tags: z.array(z.string().min(1).max(30)).min(1, "At least one tag is required").max(10, "Maximum of 10 tags"),
  category: z.nativeEnum(IdeaCategory, {
    errorMap: () => ({ message: "Please select a valid category." }),
  }),
  userId: z.string(),
  userName: z.string(),
  userAvatarUrl: z.string().optional(),
});

export type SubmitIdeaState = {
  message?: string | null;
  errors?: {
    title?: string[];
    description?: string[];
    tags?: string[];
    category?: string[];
    general?: string[];
  };
  success: boolean;
  submittedIdea?: Idea;
}

export async function submitIdeaAction(
  prevState: SubmitIdeaState,
  formData: FormData
): Promise<SubmitIdeaState> {
  const rawFormData = {
    title: formData.get('title'),
    description: formData.get('description'),
    tags: formData.get('tags') ? (formData.get('tags') as string).split(',') : [],
    category: formData.get('category'),
    userId: formData.get('userId'),
    userName: formData.get('userName'),
    userAvatarUrl: formData.get('userAvatarUrl'),
  };

  const validatedFields = ideaFormSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation failed. Please check your input.",
      success: false,
    };
  }
  
  const data = validatedFields.data;

  try {
    const vibrantColors = [
      'E91E63', '4CAF50', 'FFC107', '2196F3', '9C27B0', 'FF5722', '00BCD4', 'F44336',
      '3F51B5', '009688', 'FF9800', '673AB7', '795548', '607D8B', '2ECC71', '3498DB',
      'E67E22', '9B59B6', '1ABC9C', 'E74C3C', 'F1C40F', 'D35400'
    ];
    const randomColor = vibrantColors[Math.floor(Math.random() * vibrantColors.length)];
    const textForPlaceholder = encodeURIComponent(data.title.substring(0,15).trim().replace(/[^a-zA-Z0-9 ]/g, "") || "Idea");
    const textColor = ['F1C40F', 'FFC107', 'FFEB3B', 'CDDC39'].includes(randomColor) ? '333333' : 'FFFFFF';


    const newIdea: Idea = {
      id: `idea-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      title: data.title,
      description: data.description,
      tags: data.tags,
      category: data.category, 
      userId: data.userId,
      userName: data.userName,
      userAvatarUrl: data.userAvatarUrl,
      createdAt: new Date().toISOString(),
      upvotes: 0,
      coverImageUrl: `https://placehold.co/600x400/${randomColor}/${textColor}.png?text=${textForPlaceholder}`
    };

    return { message: "Idea submitted successfully!", success: true, submittedIdea: newIdea };
  } catch (error) {
    console.error("Error submitting idea:", error);
    return { message: "An unexpected error occurred. Please try again.", success: false, errors: { general: ["Server error."] } };
  }
}


export async function suggestTagsAction(input: SuggestTagsInput): Promise<SuggestTagsOutput> {
  return aiSuggestTags(input);
}

export async function ideaChatbotAction(input: IdeaChatbotInput): Promise<IdeaChatbotOutput> {
  return aiIdeaChatbot(input);
}

export async function generateHeroImageAction(input?: GenerateHeroImageInput): Promise<GenerateHeroImageOutput | { error: string }> {
  try {
    return await aiGenerateHeroImage(input);
  } catch (error) {
    console.error("Server action error generating hero image:", error);
    return { error: "Failed to generate hero image. Please try again later." };
  }
}
