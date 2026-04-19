'use client';

import React, { useState } from 'react';
import styles from './Header.module.css';
import { Search, Bell, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, logout } = useAuth();

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

        <div className={styles.notification}>
          <Bell size={20} />
          <span className={styles.badge}>1</span>
        </div>

        <div className={styles.profileContainer}>
          <div className={styles.profile} onClick={() => setDropdownOpen(!dropdownOpen)}>
            <div className={styles.avatar}>{user?.avatar || '??'}</div>
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
