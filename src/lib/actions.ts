"use server";

import type { Idea, IdeaCategory } from './types';
import { z } from 'zod';
import { suggestTags as aiSuggestTags, type SuggestTagsInput, type SuggestTagsOutput } from '@/ai/flows/suggest-tags';
import { ideaChatbot as aiIdeaChatbot, type IdeaChatbotInput, type IdeaChatbotOutput } from '@/ai/flows/idea-chatbot';


const ideaFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  description: z.string().min(20, "Description must be at least 20 characters").max(5000),
  tags: z.array(z.string().min(1).max(30)).min(1, "At least one tag is required").max(10, "Maximum of 10 tags"),
  category: z.string(), // Will validate against IdeaCategory enum values manually or refine schema
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

// This is a mock "database" operation. In a real app, you'd use a database.
// For simplicity, we won't implement actual storage here, but demonstrate the server action structure.
export async function submitIdeaAction(
  prevState: SubmitIdeaState,
  formData: FormData
): Promise<SubmitIdeaState> {
  const rawFormData = {
    title: formData.get('title'),
    description: formData.get('description'),
    // Tags are passed as a comma-separated string from the hidden input
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
  
  // Validate category
  const categoryValues = Object.values(rawFormData.category ? rawFormData.category as string : "");
  if (!categoryValues.includes(rawFormData.category as string)) {
     return {
      message: "Invalid category selected.",
      success: false,
      errors: { category: ["Invalid category selected."] }
    };
  }


  const data = validatedFields.data;

  try {
    // Simulate saving to a database
    const newIdea: Idea = {
      id: `idea-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      title: data.title,
      description: data.description,
      tags: data.tags,
      category: data.category as IdeaCategory,
      userId: data.userId,
      userName: data.userName,
      userAvatarUrl: data.userAvatarUrl,
      createdAt: new Date().toISOString(),
      upvotes: 0,
      coverImageUrl: `https://placehold.co/600x400.png?text=${encodeURIComponent(data.title.substring(0,15))}`
    };

    // In a real app, you'd save `newIdea` to your database.
    // For this demo, we'll just return it.
    // You might also want to revalidate paths if using Next.js caching.
    // revalidatePath('/'); 

    return { message: "Idea submitted successfully!", success: true, submittedIdea: newIdea };
  } catch (error) {
    console.error("Error submitting idea:", error);
    return { message: "An unexpected error occurred. Please try again.", success: false, errors: { general: ["Server error."] } };
  }
}


// Wrapper for AI suggestTags flow to be used as a server action if needed,
// though Genkit flows are already server actions.
export async function suggestTagsAction(input: SuggestTagsInput): Promise<SuggestTagsOutput> {
  return aiSuggestTags(input);
}

// Wrapper for AI ideaChatbot flow
export async function ideaChatbotAction(input: IdeaChatbotInput): Promise<IdeaChatbotOutput> {
  return aiIdeaChatbot(input);
}
