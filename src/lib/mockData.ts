
import type { Idea } from './types';
import { IdeaCategory } from './types';

const MOCK_USER_1 = { id: 'user1', name: 'Alice Wonderland', avatarUrl: 'https://placehold.co/100x100/E91E63/FFFFFF.png?text=A' };
const MOCK_USER_2 = { id: 'user2', name: 'Bob The Builder', avatarUrl: 'https://placehold.co/100x100/4CAF50/FFFFFF.png?text=B' };
const MOCK_USER_3 = { id: 'user3', name: 'Charlie Chaplin', avatarUrl: 'https://placehold.co/100x100/FFC107/333333.png?text=C' };


export const mockIdeas: Idea[] = [
  {
    id: '1',
    title: 'AI-Powered Personal Garden Assistant',
    description: 'An app that uses AI to identify plant diseases, suggest optimal watering schedules, and provide personalized gardening tips. It connects to smart sensors in your garden for real-time data.',
    tags: ['AI', 'Gardening', 'MobileApp', 'IoT', 'Sustainability'],
    category: IdeaCategory.SOFTWARE,
    userId: MOCK_USER_1.id,
    userName: MOCK_USER_1.name,
    userAvatarUrl: MOCK_USER_1.avatarUrl,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), 
    upvotes: 152,
    coverImageUrl: 'https://placehold.co/600x400/2ECC71/FFFFFF.png?text=GardenAI',
    dataAiHint: "garden tech"
  },
  {
    id: '2',
    title: 'Interactive Storytelling Platform for Kids',
    description: 'A web platform where children can create their own interactive stories by choosing characters, settings, and plot twists. Features collaborative storytelling and animated illustrations.',
    tags: ['Education', 'Kids', 'Storytelling', 'WebPlatform', 'Creativity'],
    category: IdeaCategory.EDUCATION_LEARNING,
    userId: MOCK_USER_2.id,
    userName: MOCK_USER_2.name,
    userAvatarUrl: MOCK_USER_2.avatarUrl,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), 
    upvotes: 230,
    coverImageUrl: 'https://placehold.co/600x400/3498DB/FFFFFF.png?text=StoryFun',
    dataAiHint: "kids story"
  },
  {
    id: '3',
    title: 'Sustainable Urban Commuting Solution',
    description: 'A network of modular, solar-powered e-bike charging stations combined with a subscription service for high-quality e-bikes. Aims to reduce traffic congestion and promote green transport.',
    tags: ['Sustainability', 'UrbanPlanning', 'Ebike', 'GreenTech', 'Transportation'],
    category: IdeaCategory.SUSTAINABILITY_ENVIRONMENT,
    userId: MOCK_USER_3.id,
    userName: MOCK_USER_3.name,
    userAvatarUrl: MOCK_USER_3.avatarUrl,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), 
    upvotes: 98,
    coverImageUrl: 'https://placehold.co/600x400/E67E22/FFFFFF.png?text=EcoRide',
    dataAiHint: "ebike city"
  },
  {
    id: '4',
    title: 'Virtual Reality Museum Tours',
    description: 'Experience world-famous museums from the comfort of your home using VR. Includes guided tours, interactive exhibits, and historical context provided by virtual curators.',
    tags: ['VR', 'Museum', 'Culture', 'Technology', 'Education'],
    category: IdeaCategory.CREATIVE_ARTS,
    userId: MOCK_USER_1.id,
    userName: MOCK_USER_1.name,
    userAvatarUrl: MOCK_USER_1.avatarUrl,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), 
    upvotes: 188,
    coverImageUrl: 'https://placehold.co/600x400/9B59B6/FFFFFF.png?text=VRMuseum',
    dataAiHint: "virtual museum"
  },
  {
    id: '5',
    title: 'Personalized Mental Wellness Companion',
    description: 'An AI chatbot that provides daily mental wellness check-ins, guided meditation sessions, and personalized coping strategies based on user input and mood tracking.',
    tags: ['MentalHealth', 'AI', 'Wellness', 'Chatbot', 'MobileApp'],
    category: IdeaCategory.HEALTH_WELLNESS,
    userId: MOCK_USER_2.id,
    userName: MOCK_USER_2.name,
    userAvatarUrl: MOCK_USER_2.avatarUrl,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), 
    upvotes: 305,
    coverImageUrl: 'https://placehold.co/600x400/1ABC9C/FFFFFF.png?text=MindWell',
    dataAiHint: "wellness app"
  },
  {
    id: '6',
    title: 'Community Skill-Share Network',
    description: 'A hyperlocal platform connecting neighbors for skill exchange – learn to bake from Susan down the street, or teach someone basic coding. Fosters community and lifelong learning.',
    tags: ['Community', 'SkillShare', 'Local', 'Education', 'Networking'],
    category: IdeaCategory.NONPROFIT_SOCIAL,
    userId: MOCK_USER_1.id,
    userName: MOCK_USER_1.name,
    userAvatarUrl: MOCK_USER_1.avatarUrl,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(), 
    upvotes: 120,
    coverImageUrl: 'https://placehold.co/600x400/E74C3C/FFFFFF.png?text=Connect',
    dataAiHint: "community sharing"
  },
  {
    id: '7',
    title: 'AI-Driven Ethical Fashion Advisor',
    description: 'An app that scans clothing brands and items to provide a score on their ethical and sustainability practices. Helps consumers make informed choices to support responsible brands.',
    tags: ['EthicalFashion', 'Sustainability', 'AI', 'ConsumerTech', 'App'],
    category: IdeaCategory.SUSTAINABILITY_ENVIRONMENT,
    userId: MOCK_USER_2.id,
    userName: MOCK_USER_2.name,
    userAvatarUrl: MOCK_USER_2.avatarUrl,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), 
    upvotes: 205,
    coverImageUrl: 'https://placehold.co/600x400/F1C40F/333333.png?text=EthiWear',
    dataAiHint: "fashion ethics"
  },
  {
    id: '8',
    title: 'Gamified Language Learning for Niche Languages',
    description: 'A mobile game that makes learning less common or endangered languages fun and accessible. Uses storytelling, cultural immersion techniques, and community challenges.',
    tags: ['LanguageLearning', 'Gamification', 'Education', 'Culture', 'MobileGame'],
    category: IdeaCategory.EDUCATION_LEARNING,
    userId: MOCK_USER_3.id,
    userName: MOCK_USER_3.name,
    userAvatarUrl: MOCK_USER_3.avatarUrl,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(), 
    upvotes: 165,
    coverImageUrl: 'https://placehold.co/600x400/D35400/FFFFFF.png?text=LingoPlay',
    dataAiHint: "language game"
  },
];
