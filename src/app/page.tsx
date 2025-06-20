import { MainLayout } from "@/components/layout/MainLayout";
import { IdeaFeed } from "@/components/ideas/IdeaFeed";

export default function HomePage() {
  return (
    <MainLayout>
      <div className="py-8">
        <header className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-headline font-bold text-primary mb-4 animate-fadeIn">
            Welcome to IdeaSpark!
          </h1>
          <p className="text-xl md:text-2xl text-foreground max-w-3xl mx-auto animate-slideInUp" style={{ animationDelay: '0.2s' }}>
            Discover, share, and ignite creativity. Explore innovative ideas or submit your own.
          </p>
        </header>
        <IdeaFeed />
      </div>
    </MainLayout>
  );
}
