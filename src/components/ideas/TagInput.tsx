
"use client";

import React, { useState, KeyboardEvent, ChangeEvent, useEffect, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X as XIcon, RefreshCw } from 'lucide-react';
import { suggestTags, type SuggestTagsInput, type SuggestTagsOutput } from '@/ai/flows/suggest-tags';
import { useToast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/core/LoadingSpinner';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  descriptionForAISuggestions?: string;
}

// Debounce function
function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<F>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };

  return debounced as (...args: Parameters<F>) => ReturnType<F>;
}


export function TagInput({ value: tags, onChange, descriptionForAISuggestions }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [suggestedTags, setSuggestedTags] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const addTag = (tag: string) => {
    const newTag = tag.trim();
    if (newTag && !tags.includes(newTag) && tags.length < 10) {
      onChange([...tags, newTag]);
    }
    setInputValue('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  const fetchTagSuggestions = useCallback(async (description: string) => {
    if (!description || description.length < 20) { // Minimum length for useful suggestions
      setSuggestedTags([]);
      return;
    }
    setIsLoadingSuggestions(true);
    try {
      const input: SuggestTagsInput = { ideaDescription: description };
      const output: SuggestTagsOutput = await suggestTags(input);
      // Filter out tags already added by the user and limit suggestions
      const newSuggestions = output.tags.filter(tag => !tags.includes(tag)).slice(0, 5);
      setSuggestedTags(newSuggestions);
    } catch (error) {
      console.error("Error fetching tag suggestions:", error);
      toast({
        title: "Error",
        description: "Could not fetch tag suggestions. Please try again.",
        variant: "destructive",
      });
      setSuggestedTags([]);
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, [tags, toast]);
  
  const debouncedFetchTagSuggestions = useCallback(debounce(fetchTagSuggestions, 1000), [fetchTagSuggestions]);

  useEffect(() => {
    if (descriptionForAISuggestions) {
      debouncedFetchTagSuggestions(descriptionForAISuggestions);
    }
  }, [descriptionForAISuggestions, debouncedFetchTagSuggestions]);

  const handleRefreshSuggestions = () => {
    if (descriptionForAISuggestions) {
      fetchTagSuggestions(descriptionForAISuggestions);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 p-2 border border-input rounded-md min-h-[40px] items-center bg-background">
        {tags.map(tag => (
          <Badge key={tag} variant="secondary" className="flex items-center gap-1 text-sm py-1 px-2">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="rounded-full hover:bg-destructive/20 p-0.5"
              aria-label={`Remove ${tag} tag`}
            >
              <XIcon className="h-3 w-3 text-destructive" />
            </button>
          </Badge>
        ))}
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={tags.length > 0 ? "Add more tags..." : "Add tags (e.g., AI, Art)..."}
          className="flex-grow border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 p-1 h-auto min-w-[120px]"
          disabled={tags.length >= 10}
        />
      </div>
      {tags.length >= 10 && (
        <p className="text-xs text-destructive mt-1">Maximum of 10 tags reached.</p>
      )}
      { (suggestedTags.length > 0 || isLoadingSuggestions) && (
        <div className="mt-3 p-3 border border-dashed border-primary/50 rounded-md bg-primary/5">
          <div className="flex justify-between items-center mb-2">
            <h4 className="text-sm font-medium text-primary">Suggested Tags:</h4>
            <Button variant="ghost" size="sm" onClick={handleRefreshSuggestions} disabled={isLoadingSuggestions || !descriptionForAISuggestions} className="button-hover-effect">
              {isLoadingSuggestions ? <LoadingSpinner size={16} /> : <RefreshCw className="h-4 w-4" />}
            </Button>
          </div>
          {isLoadingSuggestions && suggestedTags.length === 0 && (
             <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <LoadingSpinner size={16} />
                <span>Loading suggestions...</span>
             </div>
          )}
          {suggestedTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {suggestedTags.map(tag => (
                <Button
                  key={tag}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => { addTag(tag); setSuggestedTags(st => st.filter(s => s !== tag)); }}
                  className="text-primary border-primary hover:bg-primary/10 button-hover-effect"
                >
                  + {tag}
                </Button>
              ))}
            </div>
          )}
           {!isLoadingSuggestions && suggestedTags.length === 0 && descriptionForAISuggestions && (
            <p className="text-sm text-muted-foreground">No new suggestions at the moment, or your description is too short.</p>
          )}
        </div>
      )}
    </div>
  );
}
