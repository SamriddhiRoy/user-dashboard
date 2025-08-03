'use client';

import { useAuth } from '@/components/providers/AuthProvider';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/dashboard/Sidebar';
import Header from '@/components/dashboard/Header';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast'; // Ensure Toaster is imported if you're using react-hot-toast

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, userRole } = useAuth();

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!loading && !user) {
      redirect('/login');
    }
  }, [user, loading]);

  // Show a loading state while authentication status is being determined
  if (loading || !user) {
    // You can replace this with a proper loading spinner component
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar component, passing userRole for conditional rendering */}
      <Sidebar userRole={userRole} />
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header component, which might contain the NotificationDrawer and Logout button */}
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 dark:bg-gray-950 p-6">
          {children} {/* This is where the content of pages like app/(dashboard)/page.tsx will be rendered */}
        </main>
      </div>
      <Toaster /> {/* Place Toaster here to ensure it's available across dashboard pages */}
    </div>
  );
}
