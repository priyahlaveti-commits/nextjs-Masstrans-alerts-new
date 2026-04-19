'use client';

import React, { useState } from 'react';
import styles from './Header.module.css';
import { Search, Bell, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { useRouter } from 'next/navigation';

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const router = useRouter();

  return (
    <header className={styles.header}>
      <div className={styles.leftSection}>
        <div className={styles.headerTitle}>Masstrans Alerts</div>
        <div className={styles.searchContainer}>
          <div className={styles.searchIconWrapper}>
            <Search size={18} className={styles.searchIcon} />
          </div>
          <input
            type="text"
            placeholder="Search..."
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.liveIndicator}>
          <span className={styles.liveDot} />
          <span className={styles.liveText}>LIVE</span>
          <span className={styles.liveSubtext}>auto-refresh 30s</span>
        </div>

        <div 
          className={styles.notification} 
          onClick={() => router.push('/notifications')}
          title="Notifications"
        >
          <Bell size={20} />
          {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
        </div>

        <div className={styles.profileContainer}>
          <div className={styles.profile} onClick={() => setDropdownOpen(!dropdownOpen)}>
            {user?.avatar ? (
              <img src={user.avatar} alt="Avatar" className={styles.avatarImg} />
            ) : (
              <div className={styles.avatarInitials}>
                {user?.name
                  ? user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                  : '??'}
              </div>
            )}
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user?.name || 'Guest User'}</span>
              <span className={styles.userRole}>{user?.role || 'Visitor'}</span>
            </div>
            <ChevronDown size={16} className={styles.chevron} />
          </div>

          {dropdownOpen && (
            <div className={styles.dropdownMenu}>
              <button onClick={logout} className={styles.dropdownItem}>
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
