'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styles from './alerts.module.css';
import { Filter, Calendar, Car, Mail, Loader, MapPin, AlertCircle } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Vehicle {
  terid: string;
  vehicleNumber: string;
}

interface AlarmType {
  typeId: number;
  name: string;
}

interface AlertRecord {
  sNo: number;
  time: string;
  alertType: string;
  alertTypeId: number;
  speed: number;
  latitude: string;
  longitude: string;
  direction: number;
  description: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const BACKEND_URL = 'http://127.0.0.1:3001';

export default function AlertsPage() {
  // Filter States
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedDate, setSelectedDate] = useState(() =>
    new Date().toISOString().split('T')[0]
  );

  // Data States
  const [records, setRecords] = useState<AlertRecord[]>([]);
  const [totalAlerts, setTotalAlerts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  
  // Email Modal States
  const [showModal, setShowModal] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);

  // ── 1. Initialization: Fetch Vehicles ───────────────────────────────────────
  useEffect(() => {
    fetch(`${BACKEND_URL}/alerts/vehicles`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch vehicles');
        return res.json();
      })
      .then((data: Vehicle[]) => {
        setVehicles(data);
        if (data.length > 0) setSelectedVehicle(data[0].vehicleNumber);
      })
      .catch(err => {
        console.error(err);
        setError('Backend integration error. Ensure NestJS is running.');
      })
      .finally(() => setInitLoading(false));
  }, []);

  // ── 2. Data Fetching: Alert Details ────────────────────────────────────────
  const fetchDetails = useCallback(async (vNum: string, date: string) => {
    if (!vNum || !date) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BACKEND_URL}/alerts/details`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleNumber: vNum, date }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setRecords(data.alerts || []);
      setTotalAlerts(data.totalAlerts || 0);
    } catch (err) {
      console.error(err);
      setError('Could not fetch alert records.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch when filters change
  useEffect(() => {
    if (selectedVehicle) {
      fetchDetails(selectedVehicle, selectedDate);
    }
  }, [selectedVehicle, selectedDate, fetchDetails]);

  const handleSendEmail = () => {
    setShowModal(true);
  };

  const submitEmail = async () => {
    if (!emailInput) return;
    
    // Split emails by comma or space
    const emailList = emailInput.split(/[ ,]+/).filter(e => e.includes('@'));
    if (emailList.length === 0) {
      alert("Please enter valid email addresses.");
      return;
    }

    setEmailLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/alerts/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleNumber: selectedVehicle,
          date: selectedDate,
          emails: emailList,
        }),
      });

      if (res.ok) {
        setToastMsg('PDF Report sent successfully!');
        setShowToast(true);
        setShowModal(false);
        setEmailInput('');
        setTimeout(() => setShowToast(false), 4000);
      } else {
        const errData = await res.json();
        alert(`Failed to send email: ${errData.message || 'Error'}`);
      }
    } catch (err) {
      console.error(err);
      alert('Network error while sending email.');
    } finally {
      setEmailLoading(false);
    }
  };

  if (initLoading) {
    return (
      <div className={styles.loadingContainer}>
        <Loader size={48} className={styles.spinner} />
        <p>Loading application data...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Filters Section */}
      <div className={styles.filterSection}>
        <div className={styles.titleGroup}>
          <h1 className={styles.pageTitle}>Vehicle Wise Alerts</h1>
          {error && (
            <div className={styles.errorBanner}>
              <AlertCircle size={16} /> {error}
            </div>
          )}
        </div>
        
        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <Car size={18} className={styles.filterIcon} />
            <select 
              value={selectedVehicle} 
              onChange={(e) => setSelectedVehicle(e.target.value)}
              className={styles.filterSelect}
            >
              {vehicles.map(v => (
                <option key={v.terid} value={v.vehicleNumber}>
                  {v.vehicleNumber}
                </option>
              ))}
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
        </div>
      </div>

      <div className={styles.actionSection}>
        <div className={styles.statsSummary}>
          Showing <strong>{records.length}</strong> alerts for vehicle <strong>{selectedVehicle}</strong>
        </div>
        <button className={styles.emailBtn} onClick={handleSendEmail} disabled={records.length === 0}>
          <Mail size={16} /> Send Email
        </button>
      </div>

      {/* Vehicle Wise Alerts Table */}
      <div className={styles.section}>
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <span>Alert Records for {selectedVehicle} ({selectedDate})</span>
            {loading && <Loader size={16} className={styles.spinner} />}
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>S.No</th>
                  <th>Time</th>
                  <th>Alert Type</th>
                  <th>Speed</th>
                  <th>Location</th>
                  <th>Direction</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {records.length > 0 ? (
                  records.map((record) => (
                    <tr key={`${record.sNo}-${record.time}`}>
                      <td className={styles.sNoCell}>{record.sNo}</td>
                      <td className={styles.timeCell}>{new Date(record.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</td>
                      <td className={styles.boldText}>
                        <span className={styles.typeTag}>{record.alertType}</span>
                      </td>
                      <td className={styles.speedCell}>
                        <span className={record.speed > 80 ? styles.highSpeed : ''}>
                          {record.speed} km/h
                        </span>
                      </td>
                      <td className={styles.locationCell}>
                        <a 
                          href={`https://www.google.com/maps?q=${record.latitude},${record.longitude}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={styles.mapLink}
                        >
                          <MapPin size={14} /> {record.latitude}, {record.longitude}
                        </a>
                      </td>
                      <td>{record.direction}°</td>
                      <td className={styles.descriptionCell}>{record.description}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className={styles.emptyCell}>
                      {loading ? 'Fetching alert data...' : 'No alerts recorded for this selection.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showToast && (
        <div className={styles.toast}>
          {toastMsg}
        </div>
      )}

      {/* Email Modal */}
      {showModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3 className={styles.modalTitle}>Send Records via Email</h3>
            <p className={styles.modalSub}>Enter one or more email addresses separated by commas.</p>
            <textarea
              className={styles.modalInput}
              placeholder="example@mail.com, user@masstrans.com"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              rows={3}
            />
            <div className={styles.modalActions}>
              <button 
                className={styles.cancelBtn} 
                onClick={() => setShowModal(false)}
                disabled={emailLoading}
              >
                Cancel
              </button>
              <button 
                className={styles.submitBtn} 
                onClick={submitEmail}
                disabled={emailLoading || !emailInput}
              >
                {emailLoading ? <Loader size={16} className={styles.spinner} /> : 'Send PDF'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
