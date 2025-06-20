'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Logo } from './Logo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlusCircle, LogIn, LogOut, UserCircle, Menu, X } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import React, { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const { user, logout, loading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);


  const navLinks = [
    { href: '/', label: 'Feed' },
    { href: '/submit-idea', label: 'Submit Idea', authRequired: true },
  ];

  const commonButtonClasses = "button-hover-effect";

  const renderNavLinks = (isMobile: boolean = false) => (
    navLinks.map(link => {
      if (link.authRequired && !user) return null;
      const isActive = pathname === link.href;
      return (
        <Button
          key={link.label}
          variant="ghost"
          asChild
          className={cn(
            commonButtonClasses,
            "text-foreground hover:text-primary hover:bg-primary/10",
            isActive && "text-primary bg-primary/10 font-semibold",
            isMobile && "w-full justify-start text-lg py-3"
          )}
        >
          <Link href={link.href}>{link.label}</Link>
        </Button>
      );
    })
  );


  if (loading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
          <Logo />
          <div className="h-8 w-24 rounded-md bg-muted animate-pulse"></div>
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
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10 border-2 border-primary">
                    <AvatarImage src={user.avatarUrl} alt={user.name || user.email} data-ai-hint="profile avatar" />
                    <AvatarFallback>{user.name ? user.name.substring(0,1).toUpperCase() : user.email.substring(0,1).toUpperCase()}</AvatarFallback>
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
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" asChild className={cn(commonButtonClasses, "text-foreground hover:text-primary hover:bg-primary/10")}>
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" /> Log In
                </Link>
              </Button>
              <Button asChild className={cn(commonButtonClasses, "bg-primary text-primary-foreground hover:bg-primary/90")}>
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
                <div className="flex flex-col space-y-4">
                  {renderNavLinks(true)}
                  <hr className="my-4 border-border" />
                  {user ? (
                     <>
                      <Button variant="ghost" onClick={() => { logout(); setIsMobileMenuOpen(false); }} className={cn(commonButtonClasses, "w-full justify-start text-lg py-3 text-red-500 hover:text-red-600")}>
                        <LogOut className="mr-3 h-5 w-5" /> Log Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" asChild className={cn(commonButtonClasses, "w-full justify-start text-lg py-3")}>
                        <Link href="/login"><LogIn className="mr-3 h-5 w-5" /> Log In</Link>
                      </Button>
                      <Button asChild className={cn(commonButtonClasses, "w-full justify-start text-lg py-3 bg-primary text-primary-foreground hover:bg-primary/90")}>
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

// Helper to apply cn function, as it cannot be used directly in template strings in attributes
import { cn } from "@/lib/utils";
import { useRouter } from 'next/navigation';
