'use client';

import React, { useState } from 'react';
import styles from './alerts.module.css';
import { Filter, Calendar, Car, Mail } from 'lucide-react';

// Mock Data
const MOCK_VEHICLES = ['AP 01 BB 5856', 'TS 09 CC 1234', 'MH 12 DD 5678'];

const MOCK_ALERT_RECORDS = [
  { id: 1, time: '10:23 AM', type: 'Overspeeding', severity: 'High', location: 'Mayapuri, Delhi', speed: '85 km/h' },
  { id: 2, time: '11:45 AM', type: 'Harsh Braking', severity: 'Medium', location: 'Connaught Place, Delhi', speed: '40 km/h' },
  { id: 3, time: '01:15 PM', type: 'Route Deviation', severity: 'Low', location: ' द्वारका, Delhi', speed: '50 km/h' },
  { id: 4, time: '02:30 PM', type: 'Idling', severity: 'Medium', location: 'Gurugram', speed: '0 km/h' },
  { id: 5, time: '04:00 PM', type: 'Overspeeding', severity: 'High', location: 'Noida Expr', speed: '92 km/h' },
];

export default function AlertsPage() {
  const [selectedVehicle, setSelectedVehicle] = useState('AP 01 BB 5856');
  const [selectedDate, setSelectedDate] = useState('2023-10-24');
  const [showToast, setShowToast] = useState(false);

  const handleSendEmail = () => {
    // Mock sending email
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <div className={styles.container}>
      {/* Filters Section */}
      <div className={styles.filterSection}>
        <h1 className={styles.pageTitle}>Vehicle Wise Alerts</h1>
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <Car size={18} className={styles.filterIcon} />
            <select 
              value={selectedVehicle} 
              onChange={(e) => setSelectedVehicle(e.target.value)}
              className={styles.filterSelect}
            >
              {MOCK_VEHICLES.map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div className={styles.filterGroup}>
            <Calendar size={18} className={styles.filterIcon} />
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className={styles.filterInput}
            />
          </div>
          {/* Filter button removed */}
        </div>
      </div>

      <div className={styles.actionSection}>
        <button className={styles.emailBtn} onClick={handleSendEmail}>
          <Mail size={16} /> Send Email
        </button>
      </div>

      {/* Vehicle Wise Alerts Table */}
      <div className={styles.section}>
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <span>Alert Records for {selectedVehicle} ({selectedDate})</span>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Time</th>
                <th>Alert Type</th>
                <th>Severity</th>
                <th>Location</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_ALERT_RECORDS.map((record) => (
                <tr key={record.id}>
                  <td>{record.time}</td>
                  <td className={styles.boldText}>{record.type}</td>
                  <td>
                    <span className={`${styles.badge} ${styles['badge' + record.severity]}`}>
                      {record.severity}
                    </span>
                  </td>
                  <td className={styles.locationCell}>
                    {record.location}
                  </td>
                  <td className={styles.lightText}>{record.speed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showToast && (
        <div className={styles.toast}>
          Data sent to email successfully!
        </div>
      )}
    </div>
  );
}
