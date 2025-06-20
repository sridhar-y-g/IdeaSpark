"use client";

import React, { useState, useEffect, useMemo } from 'react';
import type { Idea } from '@/lib/types';
import { IdeaCard } from './IdeaCard';
import { IdeaFilters, type Filters } from './IdeaFilters';
import { mockIdeas as initialIdeas } from '@/lib/mockData'; // Using mock data
import { Button } from '../ui/button';
import { Loader2, FileQuestion } from 'lucide-react';

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

  // Simulate fetching ideas
  useEffect(() => {
    const storedIdeas = localStorage.getItem('ideaSparkIdeas');
    const ideasToLoad = storedIdeas ? JSON.parse(storedIdeas) : initialIdeas;
    
    // Ensure dates are Date objects for proper sorting
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

    // Filter by search term (title or tags)
    if (filters.searchTerm) {
      const searchTermLower = filters.searchTerm.toLowerCase();
      ideas = ideas.filter(idea =>
        idea.title.toLowerCase().includes(searchTermLower) ||
        idea.tags.some(tag => tag.toLowerCase().includes(searchTermLower))
      );
    }

    // Filter by category
    if (filters.category !== 'all') {
      ideas = ideas.filter(idea => idea.category === filters.category);
    }

    // Sort
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
        <div className="text-center py-12 text-muted-foreground">
           <FileQuestion className="mx-auto h-24 w-24 text-primary/50 mb-6" />
          <h3 className="text-2xl font-headline mb-2 text-foreground">No Ideas Found</h3>
          <p className="text-lg">Try adjusting your filters or be the first to <a href="/submit-idea" className="text-primary hover:underline">submit an idea</a>!</p>
        </div>
      )}
    </div>
  );
}

// Add className prop to IdeaCard to apply staggered animation class
declare module './IdeaCard' {
  interface IdeaCardProps {
    className?: string;
  }
}

