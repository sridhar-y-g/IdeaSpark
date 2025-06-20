export interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
}

export enum IdeaCategory {
  TECHNOLOGY = "Technology",
  ART_DESIGN = "Art & Design",
  SOCIAL_IMPACT = "Social Impact",
  BUSINESS_FINANCE = "Business & Finance",
  EDUCATION_LEARNING = "Education & Learning",
  LIFESTYLE_WELLBEING = "Lifestyle & Wellbeing",
  ENVIRONMENT_SUSTAINABILITY = "Environment & Sustainability",
  SCIENCE_RESEARCH = "Science & Research",
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
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string; // ISO string date
}
