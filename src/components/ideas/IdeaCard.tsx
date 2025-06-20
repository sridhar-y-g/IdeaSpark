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
import { ChatbotModal } from './ChatbotModal'; // Will be created later
import Link from 'next/link';

interface IdeaCardProps {
  idea: Idea;
  onUpvote: (ideaId: string) => void;
  style?: React.CSSProperties; // For staggered animation
}

export function IdeaCard({ idea, onUpvote, style }: IdeaCardProps) {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [currentUpvotes, setCurrentUpvotes] = useState(idea.upvotes);

  const handleUpvote = () => {
    onUpvote(idea.id);
    setCurrentUpvotes(prev => prev + 1); // Optimistic update
  };

  const timeAgo = formatDistanceToNow(new Date(idea.createdAt), { addSuffix: true });

  return (
    <>
      <Card className="flex flex-col h-full overflow-hidden shadow-lg card-hover-effect bg-card" style={style}>
        {idea.coverImageUrl && (
          <div className="relative w-full h-48">
            <Image
              src={idea.coverImageUrl}
              alt={idea.title}
              layout="fill"
              objectFit="cover"
              data-ai-hint="idea concept"
            />
          </div>
        )}
        <CardHeader>
          <div className="flex items-center space-x-3 mb-2">
            <Avatar className="h-10 w-10 border-2 border-primary">
              <AvatarImage src={idea.userAvatarUrl} alt={idea.userName} data-ai-hint="profile avatar" />
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
            {idea.tags.slice(0, 5).map(tag => (
              <Badge key={tag} variant="secondary" className="bg-secondary text-secondary-foreground hover:bg-primary/20 transition-colors">
                {tag}
              </Badge>
            ))}
            {idea.tags.length > 5 && <Badge variant="outline">+{idea.tags.length - 5} more</Badge>}
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
