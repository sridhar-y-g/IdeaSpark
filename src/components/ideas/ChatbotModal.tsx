"use client";

import React, { useState, useRef, useEffect } from 'react';
import type { Idea, ChatMessage } from '@/lib/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Bot, User, MessageSquare } from 'lucide-react';
import { ideaChatbotAction } from '@/lib/actions';
import { LoadingSpinner } from '@/components/core/LoadingSpinner';
import { cn } from '@/lib/utils';

interface ChatbotModalProps {
  idea: Idea;
  isOpen: boolean;
  onClose: () => void;
}

export function ChatbotModal({ idea, isOpen, onClose }: ChatbotModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setMessages([
        {
          id: 'initial-bot-message',
          sender: 'bot',
          text: `Hello! I'm IdeaSpark's AI assistant. How can I help you with the idea: "${idea.title}"?`,
          timestamp: new Date().toISOString(),
        }
      ]);
      setInputValue(''); // Clear input when modal opens
    }
  }, [isOpen, idea.title]);

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: inputValue,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await ideaChatbotAction({
        ideaTitle: idea.title,
        ideaDescription: idea.description,
        userQuestion: userMessage.text,
      });

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: response.answer,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error with chatbot:", error);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        sender: 'bot',
        text: "Sorry, I encountered an error. Please try again later.",
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0 flex flex-col max-h-[90vh]">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-center space-x-3">
             <MessageSquare className="h-8 w-8 text-primary"/>
            <div>
                <DialogTitle className="font-headline text-2xl">Chat about: {idea.title}</DialogTitle>
                <DialogDescription>Ask questions and get insights from our AI assistant.</DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <ScrollArea className="flex-grow p-6" ref={scrollAreaRef}>
          <div className="space-y-6 pr-4"> {/* Added pr-4 to prevent scrollbar overlap */}
            {messages.map(msg => (
              <div key={msg.id} className={cn("flex items-end space-x-3", msg.sender === 'user' ? 'justify-end' : 'justify-start')}>
                {msg.sender === 'bot' && (
                  <Avatar className="h-8 w-8 border-2 border-primary">
                     <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "max-w-[75%] rounded-lg px-4 py-3 shadow",
                    msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                </div>
                {msg.sender === 'user' && (
                  <Avatar className="h-8 w-8 border-2 border-accent">
                     <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
             {isLoading && (
              <div className="flex items-end space-x-3 justify-start">
                <Avatar className="h-8 w-8 border-2 border-primary">
                    <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
                </Avatar>
                <div className="bg-muted text-muted-foreground rounded-lg px-4 py-3 shadow flex items-center">
                    <LoadingSpinner size={16} className="mr-2" /> Thinking...
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="p-6 border-t">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
            className="flex w-full items-center space-x-3"
          >
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your question..."
              className="flex-grow"
              disabled={isLoading}
              aria-label="Chat input"
            />
            <Button type="submit" disabled={isLoading || !inputValue.trim()} className="button-hover-effect">
              {isLoading ? <LoadingSpinner size={20} /> : <Send className="h-5 w-5" />}
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
