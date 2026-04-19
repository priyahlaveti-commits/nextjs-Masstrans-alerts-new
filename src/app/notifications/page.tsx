'use client';

import React from 'react';
import styles from './notifications.module.css';
import { Bell, CheckCircle, Trash2, Clock, AlertCircle } from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';

export default function NotificationsPage() {
  const { notifications, markAsRead, markAllAsRead, clearAll } = useNotifications();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h1 className={styles.pageTitle}>Notifications</h1>
          <p className={styles.pageSub}>Track fleet activity and alert history</p>
        </div>
        <div className={styles.actions}>
          <button className={styles.actionBtn} onClick={markAllAsRead} disabled={notifications.length === 0}>
            <CheckCircle size={16} /> Mark all as read
          </button>
          <button className={styles.clearBtn} onClick={clearAll} disabled={notifications.length === 0}>
            <Trash2 size={16} /> Clear all
          </button>
        </div>
      </div>

      <div className={styles.listCard}>
        {notifications.length > 0 ? (
          <div className={styles.notificationList}>
            {notifications.map((n) => (
              <div 
                key={n.id} 
                className={`${styles.notificationItem} ${!n.read ? styles.unread : ''}`}
                onClick={() => !n.read && markAsRead(n.id)}
              >
                <div className={`${styles.iconWrapper} ${styles[n.type]}`}>
                  <AlertCircle size={20} />
                </div>
                <div className={styles.content}>
                  <div className={styles.itemHeader}>
                    <h4 className={styles.notifTitle}>{n.title}</h4>
                    <span className={styles.timestamp}>
                      <Clock size={12} /> {new Date(n.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className={styles.message}>{n.message}</p>
                </div>
                {!n.read && <div className={styles.unreadDot} />}
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <Bell size={48} className={styles.emptyIcon} />
            <h3>No notifications yet</h3>
            <p>We'll notify you when new alert records are detected for your vehicles.</p>
          </div>
        )}
      </div>
    </div>
  );
}
