
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Logo } from './Logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlusCircle, LogIn, LogOut, Menu, User, Bookmark } from 'lucide-react'; 
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { usePathname, useRouter } from 'next/navigation'; 
import { cn } from "@/lib/utils"; 
import { ThemeToggleButton } from './ThemeToggleButton'; // Added import

export function Navbar() {
  const { user, logout, loading } = useAuth();
  const router = useRouter(); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);


  const navLinks = [
    { href: '/', label: 'Feed' },
    { href: '/submit-idea', label: 'Submit Idea', authRequired: true },
    { href: '/saved-ideas', label: 'Saved Ideas', authRequired: true, icon: Bookmark },
  ];

  const renderNavLinks = (isMobile: boolean = false) => (
    navLinks.map(link => {
      if (link.authRequired && !user) return null;
      const isActive = pathname === link.href;
      const isSubmitIdeaLink = link.href === '/submit-idea';
      
      const buttonVariant = (isSubmitIdeaLink && !isMobile && user) ? "default" : "ghost";
      const Icon = link.icon;

      return (
        <Button
          key={link.label}
          variant={buttonVariant}
          asChild
          className={cn(
            isMobile && "w-full justify-start text-lg py-3", 
            isActive && buttonVariant === 'ghost' && "bg-primary/10 text-primary font-semibold"
          )}
        >
          <Link href={link.href}>
            {Icon && isMobile && <Icon className="mr-3 h-5 w-5" />}
            {link.label}
          </Link>
        </Button>
      );
    })
  );


  if (loading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 md:px-8">
          <Logo />
          <div className="flex items-center space-x-2">
            <div className="h-8 w-24 rounded-md bg-muted animate-pulse"></div>
            <div className="h-10 w-10 rounded-md bg-muted animate-pulse"></div> {/* Placeholder for theme toggle */}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-20 items-center justify-between max-w-screen-2xl px-4 md:px-8">
        <Logo />
        <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">
          {renderNavLinks()}
        </nav>
        <div className="flex items-center space-x-3">
          <ThemeToggleButton /> {/* Added theme toggle button */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border-2 border-primary">
                    <AvatarImage src={user.avatarUrl} alt={user.name || user.email} data-ai-hint="profile avatar" />
                    <AvatarFallback>
                      {user.name ? user.name.substring(0,1).toUpperCase() : 
                       user.email ? user.email.substring(0,1).toUpperCase() : <User className="h-5 w-5"/>}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem disabled className="font-medium leading-none">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.name || 'User'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/submit-idea')} className="cursor-pointer">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  <span>Submit Idea</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/saved-ideas')} className="cursor-pointer">
                  <Bookmark className="mr-2 h-4 w-4" />
                  <span>Saved Ideas</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" /> Log In
                </Link>
              </Button>
              <Button variant="default" asChild>
                <Link href="/signup">
                  Sign Up
                </Link>
              </Button>
            </div>
          )}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-foreground">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-xs bg-background p-6 pt-12">
                <SheetHeader className="mb-6 text-left">
                  <SheetTitle className="text-2xl font-headline">Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-4">
                  {renderNavLinks(true)}
                  <hr className="my-4 border-border" />
                  {user ? (
                     <>
                      <Button variant="ghost" onClick={() => { logout(); setIsMobileMenuOpen(false); }} className={cn("w-full justify-start text-lg py-3 text-red-500 hover:text-red-600")}>
                        <LogOut className="mr-3 h-5 w-5" /> Log Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" asChild className={cn("w-full justify-start text-lg py-3")}>
                        <Link href="/login"><LogIn className="mr-3 h-5 w-5" /> Log In</Link>
                      </Button>
                      <Button variant="default" asChild className={cn("w-full justify-start text-lg py-3")}>
                        <Link href="/signup">Sign Up</Link>
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

