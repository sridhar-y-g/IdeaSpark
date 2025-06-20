
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import type { Idea } from '@/lib/types';
import { IdeaCard } from './IdeaCard';
import { IdeaFilters, type Filters } from './IdeaFilters';
import { mockIdeas as initialIdeas } from '@/lib/mockData'; 
import { Button } from '../ui/button';
import { Loader2, FileQuestion, Sparkles } from 'lucide-react';
import Link from 'next/link';

const ITEMS_PER_PAGE = 9;

export function IdeaFeed() {
  const [allIdeas, setAllIdeas] = useState<Idea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const [filters, setFilters] = useState<Filters>({
    searchTerm: '',
    category: 'all',
    sortBy: 'recent',
  });

  useEffect(() => {
    const storedIdeasRaw = localStorage.getItem('ideaSparkIdeas');
    let ideasToLoad = initialIdeas;

    if (storedIdeasRaw) {
        try {
            const ideasFromStorage = JSON.parse(storedIdeasRaw);
            // Basic validation to ensure it's an array
            if (Array.isArray(ideasFromStorage)) {
                 // Combine mock ideas and stored ideas, prioritizing stored ones or handling updates if IDs match.
                 // For simplicity, we'll just use stored ideas if they exist, otherwise fallback to mock.
                 // A more robust solution would merge, update, or de-duplicate.
                 ideasToLoad = ideasFromStorage.length > 0 ? ideasFromStorage : initialIdeas;
            }
        } catch (e) {
            console.warn("Could not parse ideas from localStorage, falling back to initial mock data.", e);
            ideasToLoad = initialIdeas; // Fallback if parsing fails
        }
    }
    
    const processedIdeas = ideasToLoad.map((idea: Idea) => ({
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

  const filteredAndSortedIdeas = useMemo(() => {
    let ideas = [...allIdeas];

    if (filters.searchTerm) {
      const searchTermLower = filters.searchTerm.toLowerCase();
      ideas = ideas.filter(idea =>
        idea.title.toLowerCase().includes(searchTermLower) ||
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
                index={index} // Pass index for priority image loading
                onUpvote={handleUpvote} 
                style={{ animationDelay: `${index * 100}ms` }}
                className="feed-item-staggered"
              />
            ))}
          </div>
          {visibleCount < filteredAndSortedIdeas.length && (
            <div className="mt-12 text-center">
              <Button onClick={loadMoreIdeas} size="lg" className="button-hover-effect">
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
              Why not be the first to share your brilliant concept and light up the feed?
          </p>
          <Button asChild size="lg" className="button-hover-effect bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/submit-idea">
                <Sparkles className="mr-2 h-5 w-5" /> Submit Your Idea
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}

declare module './IdeaCard' {
  interface IdeaCardProps {
    className?: string;
  }
}
