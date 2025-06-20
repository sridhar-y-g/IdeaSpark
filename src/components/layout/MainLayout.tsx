import { Navbar } from './Navbar';
import { Footer } from './Footer';
import React from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 md:px-8 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
