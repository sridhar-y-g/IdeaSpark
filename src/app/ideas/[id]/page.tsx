
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
import { ThumbsUp, MessageCircle, CalendarDays, UserCircle, Tag, ArrowLeft, Download, Bookmark, Share2 } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';
import { LoadingSpinner } from '@/components/core/LoadingSpinner';
import { ChatbotModal } from '@/components/ideas/ChatbotModal';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function IdeaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  const ideaId = params.id as string;
  const [idea, setIdea] = useState<Idea | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [currentUpvotes, setCurrentUpvotes] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (ideaId) {
      const storedIdeasRaw = localStorage.getItem('ideaSparkIdeas');
      let localIdeas: Idea[] = [];
      if (storedIdeasRaw) {
        try {
          localIdeas = JSON.parse(storedIdeasRaw);
        } catch (e) {
          console.error("Error parsing ideas from localStorage", e);
        }
      }
      
      const localIdeaInstance = localIdeas.find(i => i.id === ideaId);
      const mockIdeaInstance = mockIdeas.find(i => i.id === ideaId);
      
      let finalIdea: Idea | null = null;

      if (localIdeaInstance) { 
        if (mockIdeaInstance) { 
          finalIdea = {
            ...mockIdeaInstance, 
            upvotes: localIdeaInstance.upvotes, 
            userId: localIdeaInstance.userId, 
            userName: localIdeaInstance.userName, 
            userAvatarUrl: localIdeaInstance.userAvatarUrl, 
            createdAt: localIdeaInstance.createdAt, 
          };
        } else { 
          finalIdea = localIdeaInstance;
        }
      } else if (mockIdeaInstance) { 
        finalIdea = mockIdeaInstance;
      }
      
      if (finalIdea) {
        setIdea({
            ...finalIdea,
            createdAt: typeof finalIdea.createdAt === 'string' ? finalIdea.createdAt : new Date(finalIdea.createdAt).toISOString(),
        });
        setCurrentUpvotes(finalIdea.upvotes);
      } else {
        console.error("Idea not found");
      }
      setIsLoading(false);
    }
  }, [ideaId]);

  useEffect(() => {
    if (user && idea) {
      const savedIdeasKey = `ideaSparkSavedIdeas_${user.id}`;
      const savedIdeasRaw = localStorage.getItem(savedIdeasKey);
      if (savedIdeasRaw) {
        try {
          const savedIdeaIds: string[] = JSON.parse(savedIdeasRaw);
          setIsSaved(savedIdeaIds.includes(idea.id));
        } catch (e) {
          console.error("Error parsing saved ideas from localStorage", e);
          setIsSaved(false);
        }
      } else {
        setIsSaved(false);
      }
    } else {
      setIsSaved(false); 
    }
  }, [user, idea]);


  const handleUpvote = () => {
    if (!idea) return;
    const newUpvotes = currentUpvotes + 1;
    setCurrentUpvotes(newUpvotes);
    
    const storedIdeasRaw = localStorage.getItem('ideaSparkIdeas');
    let ideasFromStorage: Idea[] = [];
    if (storedIdeasRaw) {
      try {
        ideasFromStorage = JSON.parse(storedIdeasRaw);
      } catch (e) {
        console.error("Error parsing ideas from localStorage during upvote", e);
        ideasFromStorage = [];
      }
    }

    const ideaIndex = ideasFromStorage.findIndex(i => i.id === idea.id);
    if (ideaIndex !== -1) {
      ideasFromStorage[ideaIndex].upvotes = newUpvotes;
    } else {
      const mockIdeaEquivalent = mockIdeas.find(mi => mi.id === idea.id);
      if (mockIdeaEquivalent) {
        ideasFromStorage.push({ ...mockIdeaEquivalent, upvotes: newUpvotes });
      } else if(idea) {
         ideasFromStorage.push({ ...idea, upvotes: newUpvotes });
      }
    }
    localStorage.setItem('ideaSparkIdeas', JSON.stringify(ideasFromStorage));
  };

  const handleToggleSave = () => {
    if (!user || !idea) return;
    const savedIdeasKey = `ideaSparkSavedIdeas_${user.id}`;
    let savedIdeaIds: string[] = [];
    const savedIdeasRaw = localStorage.getItem(savedIdeasKey);
    if (savedIdeasRaw) {
      try {
        savedIdeaIds = JSON.parse(savedIdeasRaw);
      } catch (e) {
        console.error("Error parsing saved ideas from localStorage", e);
        savedIdeaIds = [];
      }
    }

    const alreadySaved = savedIdeaIds.includes(idea.id);
    if (alreadySaved) {
      savedIdeaIds = savedIdeaIds.filter(id => id !== idea.id);
      toast({ title: "Idea Unsaved", description: `"${idea.title}" removed from your saved list.` });
    } else {
      savedIdeaIds.push(idea.id);
      toast({ title: "Idea Saved!", description: `"${idea.title}" added to your saved list.` });
    }
    localStorage.setItem(savedIdeasKey, JSON.stringify(savedIdeaIds));
    setIsSaved(!alreadySaved);
  };


  const handleDownloadIdea = () => {
    if (!idea) return;
    const formattedDate = format(new Date(idea.createdAt), 'MMMM d, yyyy');
    const tagsList = idea.tags.map(tag => `- ${tag}`).join('\n');
    const content = `
Idea Title: ${idea.title}
Category: ${idea.category}
Author: ${idea.userName}
Published: ${formattedDate}
Upvotes: ${currentUpvotes}

Description:
--------------------------------------------------
${idea.description}
--------------------------------------------------

Tags:
--------------------------------------------------
${tagsList}
--------------------------------------------------
    `;
    const blob = new Blob([content.trim()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeTitle = idea.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.download = `idea_${safeTitle.substring(0,30)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    if (!idea) return;
    const shareData = {
      title: idea.title,
      text: `Check out this idea on IdeaSpark: ${idea.title}`,
      url: window.location.href, // Use current URL for detail page
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast({ title: "Link Copied!", description: "Idea link copied to clipboard." });
      }
    } catch (err) {
      console.error('Error sharing idea:', err);
       if ((err as DOMException).name !== 'AbortError') {
        toast({ title: "Share Failed", description: "Could not share the idea at this time.", variant: "destructive" });
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
        <Button variant="outline" onClick={() => router.back()} className="mb-6">
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
                data-ai-hint={idea.dataAiHint || "concept illustration"}
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
            <CardTitle className="font-headline text-3xl sm:text-4xl lg:text-5xl text-primary">{idea.title}</CardTitle>
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
            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="ghost" onClick={handleUpvote} className="text-lg text-muted-foreground hover:text-primary group px-3 py-2">
                <ThumbsUp className="h-6 w-6 mr-2 group-hover:text-primary transition-colors" /> 
                {currentUpvotes}
              </Button>
              <Button variant="outline" onClick={handleDownloadIdea} className="text-lg px-3 py-2">
                <Download className="h-5 w-5 mr-2" /> Download
              </Button>
               {user && (
                <Button
                  variant="outline"
                  onClick={handleToggleSave}
                  className={cn(
                    "text-lg px-3 py-2",
                    isSaved && "border-primary text-primary hover:bg-primary/10"
                  )}
                  aria-label={isSaved ? "Unsave idea" : "Save idea"}
                >
                  <Bookmark className={cn("h-5 w-5 mr-2", isSaved && "fill-primary")} />
                  {isSaved ? 'Saved' : 'Save'}
                </Button>
              )}
              <Button variant="outline" onClick={handleShare} className="text-lg px-3 py-2">
                <Share2 className="h-5 w-5 mr-2" /> Share
              </Button>
            </div>
            <Button variant="default" onClick={() => setIsChatbotOpen(true)} className="text-lg px-6 py-3">
              <MessageCircle className="h-6 w-6 mr-2" /> Chat
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
