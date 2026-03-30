'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export default function Navigation() {
  const { data: session } = useSession();

  return (
    <nav className="border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-blue-600">🏨 Hotel Booking</span>
          </Link>

          <div className="flex items-center gap-4">
            {session ? (
              <>
                <span className="text-sm text-gray-600">{session.user?.email}</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                  {session.user?.role}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => signOut({ redirectTo: '/' })}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button size="sm" variant="outline">Sign In</Button>
                </Link>
                <Link href="/customer/search">
                  <Button size="sm">Browse Hotels</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

