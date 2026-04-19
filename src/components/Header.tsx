'use client';

import React, { useState } from 'react';
import styles from './Header.module.css';
import { Search, Bell, Clock, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { logout } = useAuth();
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
        <div className={styles.lastUpdate}>
          <Clock size={16} />
          <span>Last update : 20 min ago</span>
        </div>

        <div className={styles.notification}>
          <Bell size={20} />
          <span className={styles.badge}>1</span>
        </div>

        <div className={styles.profileContainer}>
          <div className={styles.profile} onClick={() => setDropdownOpen(!dropdownOpen)}>
            <div className={styles.avatar}>JC</div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>John Carter</span>
              <span className={styles.userRole}>Admin</span>
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
