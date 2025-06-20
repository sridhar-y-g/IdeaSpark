
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import type { Idea } from '@/lib/types';
import { MainLayout } from '@/components/layout/MainLayout';
import { IdeaCard } from '@/components/ideas/IdeaCard';
import { mockIdeas as initialIdeas } from '@/lib/mockData';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, BookmarkPlus, FileSearch } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
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

export default function SavedIdeasPage() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [allIdeas, setAllIdeas] = useState<Idea[]>([]);
  const [savedIdeaIds, setSavedIdeaIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

    // Fetch saved idea IDs after allIdeas is set
    if (user) {
      const savedIdeasKey = `ideaSparkSavedIdeas_${user.id}`;
      const currentSavedIdeasRaw = localStorage.getItem(savedIdeasKey);
      if (currentSavedIdeasRaw) {
        try {
          setSavedIdeaIds(JSON.parse(currentSavedIdeasRaw));
        } catch (e) {
          console.error("Error parsing saved ideas from localStorage", e);
          setSavedIdeaIds([]);
        }
      } else {
        setSavedIdeaIds([]);
      }
    } else {
      setSavedIdeaIds([]);
    }
    setIsLoading(authLoading);
  }, [user, authLoading]);


  const saveIdeasToLocalStorage = (ideasToSave: Idea[]) => {
    const ideasWithStringDate = ideasToSave.map(idea => ({
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

      setSavedIdeaIds(prevSavedIds => prevSavedIds.filter(id => id !== selectedIdeaIdForDeletion));
      if (user) {
        const savedIdeasKey = `ideaSparkSavedIdeas_${user.id}`;
        const newSaved = savedIdeaIds.filter(id => id !== selectedIdeaIdForDeletion);
        localStorage.setItem(savedIdeasKey, JSON.stringify(newSaved));
      }
      
      return updatedIdeas;
    });
    toast({
      title: "Idea Deleted",
      description: "The idea has been successfully removed from all lists.",
    });
    setIsConfirmDeleteDialogOpen(false);
    setSelectedIdeaIdForDeletion(null);
  };

  const savedIdeas = useMemo(() => {
    return allIdeas
      .filter(idea => savedIdeaIds.includes(idea.id))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [allIdeas, savedIdeaIds]);

  if (isLoading || authLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (!user) {
    return (
      <MainLayout>
        <div className="text-center py-16">
          <BookmarkPlus className="mx-auto h-28 w-28 text-primary/30 mb-8" />
          <h2 className="text-3xl font-headline mb-4 text-foreground">Access Your Saved Ideas</h2>
          <p className="text-lg mb-6 max-w-md mx-auto text-muted-foreground">
            Please log in to view your bookmarked ideas.
          </p>
          <Button asChild size="lg">
            <Link href="/login">Log In to View</Link>
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <header className="mb-12 lg:mb-16 text-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-headline font-bold text-primary mb-4">
          Your Saved Ideas
        </h1>
        <p className="text-lg md:text-xl text-foreground max-w-2xl mx-auto">
          Here are the brilliant concepts you've bookmarked for later.
        </p>
      </header>
      {savedIdeas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {savedIdeas.map((idea, index) => (
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
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <FileSearch className="mx-auto h-28 w-28 text-primary/30 mb-8" />
          <h3 className="text-3xl font-headline mb-3 text-foreground">No Saved Ideas Yet!</h3>
          <p className="text-lg mb-6 max-w-md mx-auto">
            You haven't bookmarked any ideas. Explore the feed and save your favorites!
          </p>
          <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href="/">
              Explore Ideas
            </Link>
          </Button>
        </div>
      )}
       <AlertDialog open={isConfirmDeleteDialogOpen} onOpenChange={setIsConfirmDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the idea from all lists.
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
    </MainLayout>
  );
}
