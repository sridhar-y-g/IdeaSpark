
"use client";

import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { IdeaCategory } from '@/lib/types';
import { Search, RotateCcw } from 'lucide-react'; // Removed Filter icon, added RotateCcw

export interface Filters {
  searchTerm: string;
  category: string; // "all" or IdeaCategory value
  sortBy: 'recent' | 'popular';
}

interface IdeaFiltersProps {
  filters: Filters;
  onFilterChange: (newFilters: Filters) => void;
  onResetFilters: () => void; // New prop for reset
}

export function IdeaFilters({ filters, onFilterChange, onResetFilters }: IdeaFiltersProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, searchTerm: e.target.value });
  };

  const handleCategoryChange = (value: string) => {
    onFilterChange({ ...filters, category: value });
  };

  const handleSortChange = (value: 'recent' | 'popular') => {
    onFilterChange({ ...filters, sortBy: value });
  };

  return (
    <div className="mb-8 p-6 bg-card rounded-lg shadow-md border border-border">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        <div className="lg:col-span-2">
          <label htmlFor="search" className="block text-sm font-medium text-foreground mb-1">Search Ideas or Tags</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="search"
              type="text"
              placeholder="e.g., 'AI app' or 'sustainability'"
              value={filters.searchTerm}
              onChange={handleInputChange}
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-foreground mb-1">Category</label>
          <Select value={filters.category} onValueChange={handleCategoryChange}>
            <SelectTrigger id="category" className="w-full">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {Object.values(IdeaCategory).map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="sort" className="block text-sm font-medium text-foreground mb-1">Sort By</label>
          <Select value={filters.sortBy} onValueChange={handleSortChange as (value: string) => void}>
            <SelectTrigger id="sort" className="w-full">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button onClick={onResetFilters} variant="outline" className="w-full md:w-auto md:self-end button-hover-effect">
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
