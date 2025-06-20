
"use client"; // This page now uses client-side hooks for dynamic image generation

import { MainLayout } from "@/components/layout/MainLayout";
import { IdeaFeed } from "@/components/ideas/IdeaFeed";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, Lightbulb, RotateCcw, Zap, Search, ThumbsUp, MessageSquare, Moon, Tag } from "lucide-react";
import React, { useState, useEffect } from 'react';
import { generateHeroImageAction } from '@/lib/actions';
import { useToast } from "@/hooks/use-toast";
import { TrendingIdeas } from "@/components/ideas/TrendingIdeas";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const STATIC_HERO_IMAGE_URL = "https://firestuff.storage.googleapis.com/misc/12867145969088238000-8472467075420925000.png";
const STATIC_HERO_IMAGE_ALT = "Diverse team collaborating on ideas";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  style?: React.CSSProperties;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, className, style }) => (
  <Card className={`flex flex-col items-center text-center p-6 feature-card-hover ${className}`} style={style}>
    <div className="p-4 bg-primary/10 rounded-full mb-4 text-primary">
      {icon}
    </div>
    <CardTitle className="font-headline text-2xl mb-2 text-primary">{title}</CardTitle>
    <CardDescription className="text-foreground leading-relaxed">{description}</CardDescription>
  </Card>
);


export default function HomePage() {
  const [heroImageUrl, setHeroImageUrl] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchHeroImage = async () => {
      try {
        const result = await generateHeroImageAction();
        if ('imageDataUri' in result && result.imageDataUri) {
          setHeroImageUrl(result.imageDataUri);
        } else if ('error' in result) {
          console.warn("Failed to generate hero image:", result.error);
        }
      } catch (error) {
        console.error("Error calling generateHeroImageAction:", error);
      }
    };

    fetchHeroImage();
  }, [toast]);

  const features = [
    {
      icon: <Lightbulb className="h-8 w-8" />,
      title: "Seamless Submission",
      description: "Easily submit your innovative ideas with a clear and intuitive form. Get your thoughts out quickly!",
    },
    {
      icon: <Tag className="h-8 w-8" />,
      title: "AI-Powered Tags",
      description: "Receive intelligent tag suggestions based on your idea description, enhancing discoverability.",
    },
    {
      icon: <Search className="h-8 w-8" />,
      title: "Explore & Filter",
      description: "Dive into a dynamic feed of ideas. Filter by category, tags, or popularity to find what inspires you.",
    },
    {
      icon: <ThumbsUp className="h-8 w-8" />,
      title: "Upvote & Save",
      description: "Show appreciation for ideas you love with upvotes, and bookmark your favorites to revisit later.",
    },
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: "AI Idea Chatbot",
      description: "Engage in insightful conversations with our AI assistant about any idea to explore it further.",
    },
    {
      icon: <Moon className="h-8 w-8" />,
      title: "Sleek Themes",
      description: "Enjoy IdeaSpark in your preferred style with beautifully designed light and dark modes.",
    },
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-background via-secondary/30 to-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left animate-slideInUp" style={{ animationDelay: '0.1s' }}>
              <h1
                className="text-5xl sm:text-6xl lg:text-7xl font-headline font-bold text-primary mb-6"
              >
                Ignite Your Next <span className="text-accent">Big Idea</span>
              </h1>
              <p
                className="text-xl md:text-2xl text-foreground max-w-xl mx-auto md:mx-0 mb-8"
              >
                IdeaSpark is the ultimate platform to brainstorm, share, and discover innovative concepts. Turn your sparks of genius into brilliant realities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button asChild size="lg" className="text-lg py-7 px-8 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/submit-idea">
                    <Lightbulb className="mr-2 h-5 w-5" /> Submit Your Idea
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg py-7 px-8 border-primary text-primary hover:bg-primary/5">
                  <Link href="#idea-feed">
                    <Sparkles className="mr-2 h-5 w-5" /> Explore Ideas
                  </Link>
                </Button>
              </div>
            </div>

            <div className="flex justify-center">
              <Image
                src={heroImageUrl || STATIC_HERO_IMAGE_URL}
                alt={STATIC_HERO_IMAGE_ALT}
                width={600}
                height={450}
                className="rounded-xl shadow-2xl"
                data-ai-hint="collaboration team"
                priority // Important for LCP
                key={heroImageUrl || STATIC_HERO_IMAGE_URL} // Add key to force re-render on src change
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trending Ideas Section */}
      <section className="py-12 lg:py-16 animate-slideInUp" style={{ animationDelay: '0.3s' }}>
        <header className="mb-10 lg:mb-12 text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-headline font-bold text-primary mb-4">
            Trending <span className="text-accent">Sparks</span>
          </h2>
          <p className="text-lg md:text-xl text-foreground max-w-2xl mx-auto">
            See what ideas are currently capturing the community's imagination.
          </p>
        </header>
        <TrendingIdeas />
      </section>

      {/* Idea Feed Section */}
      <div id="idea-feed" className="py-12 lg:py-16 animate-slideInUp" style={{ animationDelay: '0.5s' }}>
         <header className="mb-12 lg:mb-16 text-center">
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-headline font-bold text-primary mb-4"
          >
            Discover Inspiring Ideas
          </h2>
          <p
            className="text-lg md:text-xl text-foreground max-w-2xl mx-auto"
          >
            Browse through a diverse collection of creative thoughts and projects from our community.
          </p>
        </header>
        <IdeaFeed />
      </div>

      {/* Features Section */}
      <section id="features" className="py-16 lg:py-24 bg-background/50 animate-slideInUp" style={{ animationDelay: '0.7s' }}>
        <div className="container mx-auto px-4 md:px-8">
          <header className="mb-12 lg:mb-16 text-center">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-headline font-bold text-primary mb-4">
              Unlock Your <span className="text-accent">Creative Potential</span>
            </h2>
            <p className="text-lg md:text-xl text-foreground max-w-3xl mx-auto">
              IdeaSpark is packed with features designed to help you brainstorm, collaborate, and bring your best ideas to life.
            </p>
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                className="animate-fadeIn"
                style={{ animationDelay: `${index * 150}ms` }}
              />
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
