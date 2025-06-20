export function Footer() {
  return (
    <footer className="border-t border-border/40 py-8 bg-background">
      <div className="container mx-auto px-4 md:px-8 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} IdeaSpark. All rights reserved.</p>
        <p className="text-sm mt-1">Igniting creativity, one idea at a time.</p>
      </div>
    </footer>
  );
}
