
"use client";

import type { Idea } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ThumbsUp, MessageCircle, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import React, { useState } from 'react';
import { ChatbotModal } from './ChatbotModal';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface IdeaCardProps {
  idea: Idea;
  index: number; // Added index for priority loading
  onUpvote: (ideaId: string) => void;
  style?: React.CSSProperties;
  className?: string; 
}

export function IdeaCard({ idea, index, onUpvote, style, className }: IdeaCardProps) {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [currentUpvotes, setCurrentUpvotes] = useState(idea.upvotes);

  const handleUpvote = () => {
    onUpvote(idea.id);
    setCurrentUpvotes(prev => prev + 1);
  };

  const timeAgo = formatDistanceToNow(new Date(idea.createdAt), { addSuffix: true });

  return (
    <>
      <Card 
        className={cn("flex flex-col h-full overflow-hidden shadow-lg card-hover-effect bg-card group", className)} 
        style={style}
      >
        {idea.coverImageUrl && (
          <div className="relative w-full aspect-video overflow-hidden rounded-t-xl">
            <Image
              src={idea.coverImageUrl}
              alt={idea.title}
              fill
              className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
              data-ai-hint="idea concept"
              priority={index < 3} // Prioritize loading for the first 3 images
            />
          </div>
        )}
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-3 mb-3">
            <Avatar className="h-10 w-10 border-2 border-primary">
              <AvatarImage src={idea.userAvatarUrl} alt={idea.userName} data-ai-hint="profile avatar"/>
              <AvatarFallback>{idea.userName.substring(0, 1).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-foreground">{idea.userName}</p>
              <p className="text-xs text-muted-foreground">{timeAgo}</p>
            </div>
          </div>
          <CardTitle className="font-headline text-2xl text-primary hover:text-accent transition-colors">
            <Link href={`/ideas/${idea.id}`}>{idea.title}</Link>
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground pt-1">
            Category: {idea.category}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-foreground leading-relaxed line-clamp-3 mb-4">
            {idea.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {idea.tags.slice(0, 3).map(tag => (
              <Badge
                key={tag}
                variant="outline"
                className="border-primary/40 text-primary/90 bg-primary/5 hover:bg-primary/10 transition-colors text-xs px-2.5 py-1"
              >
                {tag}
              </Badge>
            ))}
            {idea.tags.length > 3 && (
              <Badge variant="outline" className="border-border text-muted-foreground text-xs px-2 py-1">
                +{idea.tags.length - 3} more
              </Badge>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center pt-4 border-t">
          <Button variant="ghost" onClick={handleUpvote} className="text-muted-foreground hover:text-primary group button-hover-effect">
            <ThumbsUp className="h-5 w-5 mr-2 group-hover:text-primary transition-colors" /> 
            {currentUpvotes}
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => setIsChatbotOpen(true)} className="text-foreground hover:text-primary hover:border-primary group button-hover-effect">
              <MessageCircle className="h-5 w-5 mr-2 group-hover:text-primary transition-colors" /> Chat
            </Button>
            <Button variant="outline" asChild className="text-foreground hover:text-primary hover:border-primary group button-hover-effect">
              <Link href={`/ideas/${idea.id}`}>
                <ExternalLink className="h-5 w-5 mr-2 group-hover:text-primary transition-colors" /> View
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
      {isChatbotOpen && (
         <ChatbotModal
          idea={idea}
          isOpen={isChatbotOpen}
          onClose={() => setIsChatbotOpen(false)}
        />
      )}
    </>
  );
}
