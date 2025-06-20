
"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import type { Idea } from '@/lib/types';
import { IdeaCard } from './IdeaCard';
import { mockIdeas as initialIdeas } from '@/lib/mockData';
import { Loader2, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

const MAX_TRENDING_IDEAS = 10; 
const CARD_WIDTH = 280; // Must match .trending-idea-item-wrapper width in globals.css
const OVERLAP_AMOUNT = 50; // Must match negative margin-left in globals.css

export function TrendingIdeas() {
  const [allIdeas, setAllIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [selectedIdeaIdForDeletion, setSelectedIdeaIdForDeletion] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);


  useEffect(() => {
    const storedIdeasRaw = localStorage.getItem('ideaSparkIdeas');
    let localIdeas: Idea[] = [];
    if (storedIdeasRaw) {
      try {
        localIdeas = JSON.parse(storedIdeasRaw);
      } catch (e) {
        console.warn("Could not parse ideas from localStorage for trending, will use initial mock data.", e);
        localIdeas = [];
      }
    }
    const localIdeasMap = new Map(localIdeas.map(idea => [idea.id, idea]));
    let wasLocalStorageUpdated = false;

    let combinedIdeas = initialIdeas.map(mockIdea => {
      const localIdea = localIdeasMap.get(mockIdea.id);
      if (localIdea) {
        if (localIdea.coverImageUrl !== mockIdea.coverImageUrl || localIdea.dataAiHint !== mockIdea.dataAiHint) {
            wasLocalStorageUpdated = true;
        }
        return {
          ...mockIdea,
          upvotes: localIdea.upvotes,
          userId: localIdea.userId,
          userName: localIdea.userName,
          userAvatarUrl: localIdea.userAvatarUrl,
          createdAt: localIdea.createdAt,
        };
      }
      return mockIdea;
    });
    const userCreatedIdeas = localIdeas.filter(localIdea => !initialIdeas.some(mockIdea => mockIdea.id === localIdea.id));
    combinedIdeas = [...combinedIdeas, ...userCreatedIdeas];
    if (wasLocalStorageUpdated || !storedIdeasRaw) {
        const ideasToSaveToLs = combinedIdeas.map(idea => ({
            ...idea,
            createdAt: typeof idea.createdAt === 'string' ? idea.createdAt : new Date(idea.createdAt).toISOString(),
        }));
        localStorage.setItem('ideaSparkIdeas', JSON.stringify(ideasToSaveToLs));
    }
    const processedIdeas = combinedIdeas.map((idea: Idea) => ({
      ...idea,
      createdAt: new Date(idea.createdAt),
    }));
    setAllIdeas(processedIdeas);
    setIsLoading(false);
  }, []);

  const saveIdeasToLocalStorage = (ideas: Idea[]) => {
    const ideasWithStringDate = ideas.map(idea => ({
        ...idea,
        createdAt: typeof idea.createdAt === 'string' ? idea.createdAt : new Date(idea.createdAt).toISOString(),
    }));
    localStorage.setItem('ideaSparkIdeas', JSON.stringify(ideasWithStringDate));
  };

  const handleUpvote = (ideaId: string) => {
    setAllIdeas(prevIdeas => {
      const updatedIdeas = prevIdeas.map(idea =>
        idea.id === ideaId ? { ...idea, upvotes: idea.upvotes + 1 } : idea
      );
      saveIdeasToLocalStorage(updatedIdeas);
      return updatedIdeas;
    });
  };

  const requestDeleteIdea = (ideaId: string) => {
    setSelectedIdeaIdForDeletion(ideaId);
    setIsConfirmDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedIdeaIdForDeletion) return;
    setAllIdeas(prevIdeas => {
      const updatedIdeas = prevIdeas.filter(idea => idea.id !== selectedIdeaIdForDeletion);
      saveIdeasToLocalStorage(updatedIdeas);
      return updatedIdeas;
    });
    toast({
      title: "Idea Deleted",
      description: "The idea has been successfully removed.",
    });
    setIsConfirmDeleteDialogOpen(false);
    setSelectedIdeaIdForDeletion(null);
  };

  const trendingIdeas = useMemo(() => {
    return [...allIdeas]
      .sort((a, b) => b.upvotes - a.upvotes)
      .slice(0, MAX_TRENDING_IDEAS);
  }, [allIdeas]);


  const updateScrollButtons = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 5); 
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5); 
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || trendingIdeas.length === 0) {
        setCanScrollLeft(false);
        setCanScrollRight(false);
        return;
    }
    
    updateScrollButtons(); 

    const handleScrollEvent = () => {
        requestAnimationFrame(updateScrollButtons);
    };
    const handleResizeEvent = () => {
        requestAnimationFrame(updateScrollButtons);
    };

    container.addEventListener('scroll', handleScrollEvent, { passive: true });
    window.addEventListener('resize', handleResizeEvent);

    return () => {
      if (container) { // Check if container exists before removing event listener
        container.removeEventListener('scroll', handleScrollEvent);
      }
      window.removeEventListener('resize', handleResizeEvent);
    };
  }, [trendingIdeas, updateScrollButtons]);


  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    // Scroll by the visible width of one card (card width - overlap amount)
    const scrollAmount = CARD_WIDTH - OVERLAP_AMOUNT; 

    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (trendingIdeas.length === 0) {
    return (
      <div className="py-10 text-center text-muted-foreground">
        <AlertTriangle className="mx-auto h-12 w-12 text-primary/30 mb-4" />
        <p>No trending ideas to display at the moment.</p>
      </div>
    );
  }

  return (
    <div className="relative px-0 sm:px-10"> {/* Add horizontal padding for button space */}
      {trendingIdeas.length > 0 && (
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-background/80 hover:bg-background disabled:opacity-30 disabled:cursor-not-allowed shadow-md"
          onClick={() => scroll('left')}
          disabled={!canScrollLeft}
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
      )}
      <div
        ref={scrollContainerRef}
        className="trending-ideas-scroll-container"
      >
        {trendingIdeas.map((idea, index) => (
          <div key={idea.id} className="trending-idea-item-wrapper">
            <IdeaCard
              idea={idea}
              index={index}
              onUpvote={handleUpvote}
              onDeleteRequest={requestDeleteIdea}
              className="w-full" 
            />
          </div>
        ))}
      </div>
      {trendingIdeas.length > 0 && (
         <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-background/80 hover:bg-background disabled:opacity-30 disabled:cursor-not-allowed shadow-md"
          onClick={() => scroll('right')}
          disabled={!canScrollRight}
          aria-label="Scroll right"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      )}
      <AlertDialog open={isConfirmDeleteDialogOpen} onOpenChange={setIsConfirmDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the idea.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedIdeaIdForDeletion(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Yes, delete idea
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

