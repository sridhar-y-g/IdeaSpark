
export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
}

export enum IdeaCategory {
  SOFTWARE = "Software",
  HARDWARE = "Hardware",
  FOOD_BEVERAGE = "Food & Beverage",
  NONPROFIT_SOCIAL = "Nonprofit & Social Impact",
  CREATIVE_ARTS = "Creative & Arts",
  EDUCATION_LEARNING = "Education & Learning",
  HEALTH_WELLNESS = "Health & Wellness",
  SUSTAINABILITY_ENVIRONMENT = "Sustainability & Environment",
  BUSINESS_FINANCE = "Business & Finance",
  OTHER = "Other",
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  tags: string[];
  category: IdeaCategory;
  userId: string;
  userName: string;
  userAvatarUrl?: string;
  createdAt: string; // ISO string date
  upvotes: number;
  coverImageUrl?: string; // Optional cover image for the idea
  dataAiHint?: string; // Optional hint for AI image search for cover images
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string; // ISO string date
}
