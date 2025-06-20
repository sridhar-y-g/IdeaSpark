
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/AuthContext';
// import AnimatedSpaceBackground from '@/components/layout/AnimatedSpaceBackground'; // Removed old background
import NewAnimatedBackground from '@/components/layout/NewAnimatedBackground'; // Added new background
import { ThemeProvider } from 'next-themes';

export const metadata: Metadata = {
  title: 'IdeaSpark - Ignite Your Creativity',
  description: 'Share, discover, and collaborate on innovative ideas.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>{/* Ensure no whitespace/newlines between <html> and <head> or <body> */}
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400;0,500;0,700;0,800;1,400;1,500;1,700;1,800&family=Belleza&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <NewAnimatedBackground />
        <div style={{ position: 'relative', zIndex: 10 }}> {/* Wrapper to ensure content is on top */}
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {/* <AnimatedSpaceBackground /> Removed old background */}
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
