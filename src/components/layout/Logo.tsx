import { Sparkles } from 'lucide-react';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 group">
      <Sparkles className="h-8 w-8 text-primary transition-transform duration-300 group-hover:rotate-12" />
      <h1 className="text-3xl font-headline font-bold text-primary group-hover:text-accent transition-colors">
        IdeaSpark
      </h1>
    </Link>
  );
}
