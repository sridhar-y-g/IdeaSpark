
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/AuthContext';
import AnimatedSpaceBackground from '@/components/layout/AnimatedSpaceBackground';
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
    <html lang="en" suppressHydrationWarning>{/* suppressHydrationWarning recommended for next-themes */}
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400;0,500;0,700;0,800;1,400;1,500;1,700;1,800&family=Belleza&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">{/* Tailwind dark class will be applied to <html> by ThemeProvider */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AnimatedSpaceBackground /> {/* This will be visible primarily in dark mode due to CSS */}
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
