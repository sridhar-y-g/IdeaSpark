
import { MainLayout } from "@/components/layout/MainLayout";
import { IdeaFeed } from "@/components/ideas/IdeaFeed";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, Lightbulb, RotateCcw } from "lucide-react";

export default function HomePage() {
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
                <Button asChild size="lg" className="button-hover-effect text-lg py-7 px-8 bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/submit-idea">
                    <Lightbulb className="mr-2 h-5 w-5" /> Submit Your Idea
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="button-hover-effect text-lg py-7 px-8 border-primary text-primary hover:bg-primary/5">
                  <Link href="#idea-feed">
                    <Sparkles className="mr-2 h-5 w-5" /> Explore Ideas
                  </Link>
                </Button>
              </div>
            </div>
            {/* Removed animate-slideInUp from this div for diagnosis */}
            <div className="flex justify-center" style={{ animationDelay: '0.3s' }}>
              <Image
                src="https://firestuff.storage.googleapis.com/misc/12867145969088238000-8472467075420925000.png"
                alt="Inspiring abstract visual representing ideas and innovation"
                width={600}
                height={450}
                className="rounded-xl shadow-2xl"
                data-ai-hint="collaboration team"
                priority
              />
            </div>
          </div>
        </div>
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
    </MainLayout>
  );
}
