import { config } from 'dotenv';
config();

import '@/ai/flows/idea-chatbot.ts';
import '@/ai/flows/suggest-tags.ts';
import '@/ai/flows/generate-hero-image-flow.ts'; // Added new flow
