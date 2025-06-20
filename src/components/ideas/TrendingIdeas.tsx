
"use client";

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import type { Idea } from '@/lib/types';
import { IdeaCard } from './IdeaCard';
import { mockIdeas as initialIdeas } from '@/lib/mockData';
import { Loader2, AlertTriangle } from 'lucide-react';
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
import { Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const MAX_TRENDING_IDEAS = 6;

export function TrendingIdeas() {
  const [allIdeas, setAllIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [selectedIdeaIdForDeletion, setSelectedIdeaIdForDeletion] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0); // Index of the card considered "active" or centered

  useEffect(() => {
    // Same loading logic as IdeaFeed
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

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || trendingIdeas.length === 0) return;

    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const containerWidth = container.offsetWidth;
    const cardElements = Array.from(container.children) as HTMLElement[];

    let closestIndex = 0;
    let minDistance = Infinity;

    cardElements.forEach((cardWrapper, index) => {
        const card = cardWrapper.firstChild as HTMLElement; // Assuming IdeaCard is the first child
        if (!card) return;

        const cardWidth = card.offsetWidth;
        const cardOffsetLeft = cardWrapper.offsetLeft; // Use wrapper's offsetLeft

        // Calculate the center of the card relative to the container's scroll position
        const cardCenter = cardOffsetLeft + cardWidth / 2;
        // Calculate the center of the viewport
        const viewportCenter = scrollLeft + containerWidth / 2;
        
        const distance = Math.abs(cardCenter - viewportCenter);

        if (distance < minDistance) {
            minDistance = distance;
            closestIndex = index;
        }
    });
    setActiveIndex(closestIndex);
  }, [trendingIdeas.length]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    container.addEventListener('scroll', onScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => {
      container.removeEventListener('scroll', onScroll);
    };
  }, [handleScroll]);


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
    <div className="relative">
      <div
        ref={scrollContainerRef}
        className="trending-ideas-scroll-container"
      >
        {trendingIdeas.map((idea, index) => (
          <div key={idea.id} className="trending-idea-item-wrapper">
            <IdeaCard
              idea={idea}
              index={index} // This index might not be the original feed index
              onUpvote={handleUpvote}
              onDeleteRequest={requestDeleteIdea}
              isActiveTrending={index === activeIndex}
              className="min-w-[300px] w-full" // Ensure cards have a minimum and take up space
            />
          </div>
        ))}
      </div>
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
