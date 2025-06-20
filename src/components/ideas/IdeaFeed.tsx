
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import type { Idea } from '@/lib/types';
import { IdeaCard } from './IdeaCard';
import { IdeaFilters, type Filters } from './IdeaFilters';
import { mockIdeas as initialIdeas } from '@/lib/mockData'; 
import { Button } from '../ui/button';
import { Loader2, FileQuestion, Sparkles, Trash2, RotateCcw } from 'lucide-react'; // Added RotateCcw
import Link from 'next/link';
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
import { useToast } from '@/hooks/use-toast';

const ITEMS_PER_PAGE = 9;

export function IdeaFeed() {
  const [allIdeas, setAllIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const { toast } = useToast();

  const [filters, setFilters] = useState<Filters>({
    searchTerm: '',
    category: 'all',
    sortBy: 'recent',
  });

  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false);
  const [selectedIdeaIdForDeletion, setSelectedIdeaIdForDeletion] = useState<string | null>(null);

  useEffect(() => {
    const storedIdeasRaw = localStorage.getItem('ideaSparkIdeas');
    let localIdeas: Idea[] = [];
    if (storedIdeasRaw) {
      try {
        localIdeas = JSON.parse(storedIdeasRaw);
      } catch (e) {
        console.warn("Could not parse ideas from localStorage, will use initial mock data.", e);
        localIdeas = []; // Fallback to empty if parsing fails
      }
    }
    
    const localIdeasMap = new Map(localIdeas.map(idea => [idea.id, idea]));
    let wasLocalStorageUpdated = false;

    // Start with fresh mock ideas, then update with local storage data if it exists
    // and refresh coverImageUrl from mockData if it's a mock idea.
    let combinedIdeas = initialIdeas.map(mockIdea => {
      const localIdea = localIdeasMap.get(mockIdea.id);
      if (localIdea) {
        // Preserve user-specific data from local storage, but use coverImageUrl and dataAiHint from current mockData
        if (localIdea.coverImageUrl !== mockIdea.coverImageUrl || localIdea.dataAiHint !== mockIdea.dataAiHint) {
            wasLocalStorageUpdated = true;
        }
        return {
          ...mockIdea, // Takes title, desc, category, tags, coverImageUrl, dataAiHint etc. from current mockData
          upvotes: localIdea.upvotes, // Preserves upvotes from local storage
          userId: localIdea.userId, // Preserves original userId, etc.
          userName: localIdea.userName,
          userAvatarUrl: localIdea.userAvatarUrl,
          createdAt: localIdea.createdAt, // Preserve original creation date from local storage if available and valid
        };
      }
      return mockIdea; // No local version, use mock idea as is
    });

    // Add any purely user-created ideas from local storage that are not in mockData
    const userCreatedIdeas = localIdeas.filter(localIdea => !initialIdeas.some(mockIdea => mockIdea.id === localIdea.id));
    combinedIdeas = [...combinedIdeas, ...userCreatedIdeas];

    // If any mock idea's image URL was updated, persist this merged and "refreshed" state back to localStorage
    if (wasLocalStorageUpdated || !storedIdeasRaw) { // also save if LS was initially empty
        const ideasToSaveToLs = combinedIdeas.map(idea => ({
            ...idea,
            // Ensure createdAt is a string for localStorage
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
    localStorage.setItem('ideaSparkIdeas', JSON.stringify(ideas));
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

  const filteredAndSortedIdeas = useMemo(() => {
    let ideas = [...allIdeas];

    if (filters.searchTerm) {
      const searchTermLower = filters.searchTerm.toLowerCase();
      ideas = ideas.filter(idea =>
        idea.title.toLowerCase().includes(searchTermLower) ||
        idea.description.toLowerCase().includes(searchTermLower) ||
        idea.tags.some(tag => tag.toLowerCase().includes(searchTermLower))
      );
    }

    if (filters.category !== 'all') {
      ideas = ideas.filter(idea => idea.category === filters.category);
    }

    if (filters.sortBy === 'recent') {
      ideas.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (filters.sortBy === 'popular') {
      ideas.sort((a, b) => b.upvotes - a.upvotes);
    }
    return ideas;
  }, [allIdeas, filters]);

  const currentIdeas = filteredAndSortedIdeas.slice(0, visibleCount);

  const loadMoreIdeas = () => {
    setVisibleCount(prevCount => prevCount + ITEMS_PER_PAGE);
  };

  const resetFilters = () => {
    setFilters({
      searchTerm: '',
      category: 'all',
      sortBy: 'recent',
    });
    setVisibleCount(ITEMS_PER_PAGE);
  };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <IdeaFilters filters={filters} onFilterChange={setFilters} onResetFilters={resetFilters} />
      {currentIdeas.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {currentIdeas.map((idea, index) => (
              <IdeaCard 
                key={idea.id} 
                idea={idea} 
                index={index} 
                onUpvote={handleUpvote} 
                onDeleteRequest={requestDeleteIdea}
                style={{ animationDelay: `${index * 100}ms` }}
                className="feed-item-staggered"
              />
            ))}
          </div>
          {visibleCount < filteredAndSortedIdeas.length && (
            <div className="mt-12 text-center">
              <Button onClick={loadMoreIdeas} size="lg">
                Load More Ideas
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
           <FileQuestion className="mx-auto h-28 w-28 text-primary/30 mb-8" />
          <h3 className="text-3xl font-headline mb-3 text-foreground">No Spark Here... Yet!</h3>
          <p className="text-lg mb-6 max-w-md mx-auto">
            {filters.searchTerm ? "No ideas match your current search. Try adjusting your filters or search term." : "Why not be the first to share your brilliant concept and light up the feed?"}
          </p>
           {filters.searchTerm ? (
            <Button onClick={resetFilters} size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <RotateCcw className="mr-2 h-5 w-5" /> Reset Search & Filters
            </Button>
           ) : (
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/submit-idea">
                  <Sparkles className="mr-2 h-5 w-5" /> Submit Your Idea
              </Link>
            </Button>
           )}
        </div>
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
              <Trash2 className="mr-2 h-4 w-4" />
              Yes, delete idea
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

declare module './IdeaCard' {
  interface IdeaCardProps {
    className?: string;
  }
}
