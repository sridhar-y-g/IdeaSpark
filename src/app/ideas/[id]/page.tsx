"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { Idea } from '@/lib/types';
import { mockIdeas } from '@/lib/mockData'; // Using mock data
import { MainLayout } from '@/components/layout/MainLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ThumbsUp, MessageCircle, CalendarDays, UserCircle, Tag, ExternalLink, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import { LoadingSpinner } from '@/components/core/LoadingSpinner';
import { ChatbotModal } from '@/components/ideas/ChatbotModal';

export default function IdeaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const ideaId = params.id as string;
  const [idea, setIdea] = useState<Idea | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [currentUpvotes, setCurrentUpvotes] = useState(0);

  useEffect(() => {
    if (ideaId) {
      // Simulate fetching idea details
      // In a real app, this would be an API call.
      // For now, try to find it in localStorage first, then mockData
      const storedIdeasRaw = localStorage.getItem('ideaSparkIdeas');
      let ideasFromStorage: Idea[] = [];
      if (storedIdeasRaw) {
        ideasFromStorage = JSON.parse(storedIdeasRaw);
      }
      
      const allAvailableIdeas = [...ideasFromStorage, ...mockIdeas.filter(mi => !ideasFromStorage.find(si => si.id === mi.id))];
      
      const foundIdea = allAvailableIdeas.find(i => i.id === ideaId);
      
      if (foundIdea) {
        setIdea(foundIdea);
        setCurrentUpvotes(foundIdea.upvotes);
      } else {
        // Handle idea not found, maybe redirect or show error
        console.error("Idea not found");
      }
      setIsLoading(false);
    }
  }, [ideaId]);

  const handleUpvote = () => {
    if (!idea) return;
    // Mock upvoting - in real app, call an API
    setCurrentUpvotes(prev => prev + 1);
    // Update localStorage if idea came from there
    const storedIdeasRaw = localStorage.getItem('ideaSparkIdeas');
    if (storedIdeasRaw) {
      let ideasFromStorage: Idea[] = JSON.parse(storedIdeasRaw);
      const ideaIndex = ideasFromStorage.findIndex(i => i.id === idea.id);
      if (ideaIndex !== -1) {
        ideasFromStorage[ideaIndex].upvotes += 1;
        localStorage.setItem('ideaSparkIdeas', JSON.stringify(ideasFromStorage));
      }
    }
  };


  if (isLoading) {
    return <MainLayout><div className="flex justify-center items-center min-h-[60vh]"><LoadingSpinner size={48} /></div></MainLayout>;
  }

  if (!idea) {
    return <MainLayout><div className="text-center py-10">Idea not found.</div></MainLayout>;
  }

  return (
    <MainLayout>
      <div className="py-8 max-w-4xl mx-auto">
        <Button variant="outline" onClick={() => router.back()} className="mb-6 button-hover-effect">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Feed
        </Button>
        <Card className="overflow-hidden shadow-xl">
          {idea.coverImageUrl && (
            <div className="relative w-full h-72 md:h-96">
              <Image
                src={idea.coverImageUrl}
                alt={idea.title}
                layout="fill"
                objectFit="cover"
                priority
                data-ai-hint="concept illustration"
              />
            </div>
          )}
          <CardHeader className="pt-6">
            <div className="flex items-center space-x-3 mb-4">
              <Avatar className="h-12 w-12 border-2 border-primary">
                <AvatarImage src={idea.userAvatarUrl} alt={idea.userName} data-ai-hint="user avatar" />
                <AvatarFallback>{idea.userName.substring(0, 1).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-lg font-semibold text-foreground flex items-center">
                  <UserCircle className="mr-2 h-5 w-5 text-muted-foreground" /> {idea.userName}
                </p>
                <p className="text-sm text-muted-foreground flex items-center">
                  <CalendarDays className="mr-2 h-4 w-4" /> Published on {format(new Date(idea.createdAt), 'MMMM d, yyyy')}
                </p>
              </div>
            </div>
            <CardTitle className="font-headline text-4xl lg:text-5xl text-primary">{idea.title}</CardTitle>
            <CardDescription className="text-lg text-muted-foreground pt-2">
              Category: {idea.category}
            </CardDescription>
          </CardHeader>
          <CardContent className="py-6 text-lg text-foreground leading-relaxed space-y-6">
            <p className="whitespace-pre-wrap">{idea.description}</p>
            
            <div>
              <h3 className="text-xl font-semibold text-primary mb-2 flex items-center">
                <Tag className="mr-2 h-5 w-5" /> Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {idea.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-sm py-1 px-3 bg-secondary text-secondary-foreground">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t gap-4">
            <Button variant="ghost" onClick={handleUpvote} className="text-lg text-muted-foreground hover:text-primary group button-hover-effect px-4 py-2">
              <ThumbsUp className="h-6 w-6 mr-2 group-hover:text-primary transition-colors" /> 
              {currentUpvotes} Upvotes
            </Button>
            <Button variant="default" onClick={() => setIsChatbotOpen(true)} className="text-lg button-hover-effect px-6 py-3">
              <MessageCircle className="h-6 w-6 mr-2" /> Chat about this Idea
            </Button>
          </CardFooter>
        </Card>
      </div>
      {isChatbotOpen && (
         <ChatbotModal
          idea={idea}
          isOpen={isChatbotOpen}
          onClose={() => setIsChatbotOpen(false)}
        />
      )}
    </MainLayout>
  );
}
