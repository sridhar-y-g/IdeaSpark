
import { MainLayout } from "@/components/layout/MainLayout";
import { IdeaFeed } from "@/components/ideas/IdeaFeed";

export default function HomePage() {
  return (
    <MainLayout>
      <div className="py-12 lg:py-16">
        <header className="mb-12 lg:mb-16 text-center">
          <h1 
            className="text-5xl sm:text-6xl lg:text-7xl font-headline font-bold text-primary mb-6 animate-slideInUp"
            style={{ animationDelay: '0.1s' }}
          >
            Welcome to IdeaSpark!
          </h1>
          <p 
            className="text-xl md:text-2xl text-foreground max-w-3xl mx-auto animate-slideInUp" 
            style={{ animationDelay: '0.3s' }}
          >
            Discover, share, and ignite creativity. Explore innovative ideas or submit your own.
          </p>
        </header>
        <div className="animate-slideInUp" style={{ animationDelay: '0.5s' }}>
          <IdeaFeed />
        </div>
      </div>
    </MainLayout>
  );
}
