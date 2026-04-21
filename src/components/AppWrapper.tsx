'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import styles from "@/app/layout.module.css";
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { NotificationProvider, useNotifications } from '@/context/NotificationContext';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();
  const { addNotification } = useNotifications();
  const [lastTotal, setLastTotal] = useState<number | null>(null);
  
  const isLoginPage = pathname === '/login';
  const router = useRouter();

  // Background Alert Watcher
  useEffect(() => {
    if (!isAuthenticated) return;

    const checkAlerts = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const res = await fetch('/api/alerts/bulk-counts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vehicleNumber: 'All', date: today }),
        });
        
        if (res.ok) {
          const counts = await res.json();
          const currentTotal = counts.reduce((acc: number, item: any) => acc + item.count, 0);
          
          if (lastTotal !== null && currentTotal > lastTotal) {
            const diff = currentTotal - lastTotal;
            addNotification(
              'New Alerts Detected',
              `${diff} new alert records have been detected for your fleet today.`,
              'alert'
            );
          }
          setLastTotal(currentTotal);
        }
      } catch (e) {
        console.error('Polling failed', e);
      }
    };

    // Initial check
    checkAlerts();
    
    // Poll every 60s
    const interval = setInterval(checkAlerts, 60000);
    return () => clearInterval(interval);
  }, [isAuthenticated, lastTotal, addNotification]);

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
      <NotificationProvider>
        <LayoutContent>{children}</LayoutContent>
      </NotificationProvider>
    </AuthProvider>
  );
}
