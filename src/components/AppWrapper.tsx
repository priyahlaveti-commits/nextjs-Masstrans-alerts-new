'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import styles from "@/app/layout.module.css";
import { AuthProvider, useAuth } from '@/context/AuthContext';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();
  
  const isLoginPage = pathname === '/login';

  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isLoginPage) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, isLoginPage, router]);

  if (isLoading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!isAuthenticated && !isLoginPage) {
    return null; 
  }

  return (
    <div className={styles.appContainer}>
      <div className={styles.dashboardWrapper}>
        <Sidebar />
        <div className={styles.mainContent}>
          <Header />
          <main className={styles.pageContent}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <LayoutContent>{children}</LayoutContent>
    </AuthProvider>
  );
}
