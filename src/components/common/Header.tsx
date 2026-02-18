'use client';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu, Rocket, User, LayoutDashboard, FileText, BrainCircuit, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import React from 'react';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { ThemeToggleButton } from './ThemeToggleButton';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/templates', label: 'Templates', icon: FileText },
  { href: '/interview', label: 'Interview', icon: BrainCircuit },
];

export function Header() {
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  const isAuthenticated = !!user;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-gradient-glass backdrop-blur-2xl no-print">
      <div className="container flex h-16 items-center">
        <div className="mr-auto flex items-center">
          <Link href="/" className="flex items-center gap-2 font-bold font-headline text-lg group">
             <div className="animate-float">
              <Rocket className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
            </div>
            <span className="tracking-tight">FitCV</span>
          </Link>
        </div>

        <nav className="hidden md:flex md:items-center md:gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'transition-colors hover:text-foreground/80 flex items-center gap-1.5',
                pathname === link.href ? 'text-foreground' : 'text-foreground/60'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          <ThemeToggleButton />
          {!isUserLoading && (
            <>
              {isAuthenticated ? (
                <UserMenu />
              ) : (
                <div className="hidden md:flex items-center gap-4">
                  <Button variant="ghost" asChild>
                    <Link href="/login">Log In</Link>
                  </Button>
                  <Button asChild variant="neuro">
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </div>
              )}
            </>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden rounded-full h-9 w-9">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col">
              <div className="flex flex-col gap-6 mt-8 flex-grow">
                <Link href="/" className="flex items-center gap-2 font-bold font-headline text-2xl">
                  <Rocket className="h-8 w-8 text-primary" />
                  <span>FitCV</span>
                </Link>
                <div className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-xl text-lg font-medium transition-all',
                        pathname === link.href ? 'bg-primary/10 text-primary' : 'hover:bg-secondary text-foreground/60'
                      )}
                    >
                      <link.icon className="h-5 w-5" />
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
              <div className="pt-6 border-t mt-auto mb-8">
                {!isAuthenticated && !isUserLoading ? (
                  <div className="flex flex-col gap-4">
                    <Button variant="outline" asChild className="w-full">
                      <Link href="/login">Log In</Link>
                    </Button>
                    <Button asChild variant="neuro" className="w-full">
                      <Link href="/signup">Sign Up Free</Link>
                    </Button>
                  </div>
                ) : (
                    <Button variant="ghost" onClick={() => signOut(useAuth())} className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
                        <LogOut className="mr-2 h-5 w-5" /> Log Out
                    </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function UserMenu() {
  const { user, userProfile } = useUser();
  const auth = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  const getInitials = (name: string) => {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
  }

  const avatarSrc = user?.photoURL || userProfile?.profilePhotoUrl || undefined;
  const fallbackText = getInitials(user?.displayName || '');


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full border-2 border-primary/20 p-0 overflow-hidden hover:scale-105 transition-transform">
          <Avatar className="h-full w-full">
            <AvatarImage src={avatarSrc} alt="User avatar" />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                {fallbackText ? fallbackText : <User className="h-5 w-5" />}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel className="font-normal p-4">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-bold leading-none">{user?.displayName || 'Career Specialist'}</p>
            <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="p-3 cursor-pointer">
          <Link href="/dashboard" className="flex items-center gap-2"><LayoutDashboard className="h-4 w-4 text-primary" /> Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="p-3 cursor-pointer">
          <Link href="/settings" className="flex items-center gap-2"><Settings className="h-4 w-4 text-primary" /> Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="p-3 cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
          <LogOut className="h-4 w-4 mr-2" /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
