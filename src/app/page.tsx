'use client';

import React, { useState } from 'react';
import styles from './page.module.css';
import { 
  Filter, 
  AlertTriangle, 
  Calendar, 
  Car, 
  VideoOff, 
  Activity, 
  EyeOff, 
  Database, 
  Zap, 
  BellRing, 
  Gauge, 
  BatteryLow, 
  FastForward, 
  MapPin, 
  PowerOff, 
  Thermometer, 
  Ruler,
  ChevronRight,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

// Specialized Alert Types
const ALERT_TYPES = [
  "Video loss alarm", "Motion detection alarm", "Camera-covering alarm", "Abnormal storage alarm",
  "IO 1", "IO 2", "IO 3", "IO 4", "IO 5", "IO 6", "IO 7", "IO 8",
  "Emergency alarm", "High-speed alarm", "Low voltage alarm", "Acceleration alarm",
  "Geo-fencing alarm", "Illegal shutdown", "Temperature alarm", "Distance alarm"
];

const MOCK_DETAILED_ALERTS = ALERT_TYPES.map((type, index) => ({
  id: index,
  type,
  current: Math.floor(Math.random() * 50) + 10,
  average: Math.floor(Math.random() * 40) + 5,
  status: Math.random() > 0.8 ? 'Alert' : 'Normal',
  icon: type.includes('Video') ? <VideoOff size={20} /> :
        type.includes('Motion') ? <Activity size={20} /> :
        type.includes('Camera') ? <EyeOff size={20} /> :
        type.includes('storage') ? <Database size={20} /> :
        type.includes('IO') ? <Zap size={20} /> :
        type.includes('Emergency') ? <BellRing size={20} /> :
        type.includes('High-speed') ? <Gauge size={20} /> :
        type.includes('voltage') ? <BatteryLow size={20} /> :
        type.includes('Acceleration') ? <FastForward size={20} /> :
        type.includes('Geo') ? <MapPin size={20} /> :
        type.includes('shutdown') ? <PowerOff size={20} /> :
        type.includes('Temp') ? <Thermometer size={20} /> :
        <Ruler size={20} />
}));

interface CircularProgressProps {
  value: number;
  total: number;
  color: string;
  label: string;
  sublabel: string;
}

const CircularProgress = ({ value, total, color, label, sublabel }: CircularProgressProps) => {
  const percentage = (value / total) * 100;
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className={styles.progressCard}>
      <div className={styles.progressCircle}>
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke="#f0f4f8"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s ease-in-out' }}
          />
        </svg>
        <div className={styles.progressValue}>
          <span>{Math.round(percentage)}%</span>
        </div>
      </div>
      <div className={styles.progressInfo}>
        <span className={styles.progressLabel}>{label}</span>
        <span className={styles.progressSublabel}>{sublabel}</span>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [selectedVehicle, setSelectedVehicle] = useState('AP 01 BB 5856');
  const [selectedDate, setSelectedDate] = useState('2023-10-24');
  const [selectedAlert, setSelectedAlert] = useState(ALERT_TYPES[0]);

  const activeAlertData = MOCK_DETAILED_ALERTS.find(a => a.type === selectedAlert) || MOCK_DETAILED_ALERTS[0];
  const diff = activeAlertData.current - activeAlertData.average;
  const isHigher = diff > 0;

  return (
    <div className={styles.container}>
      {/* Search & Selection Section */}
      <div className={styles.filterSection}>
        <div className={styles.selectors}>
          <div className={styles.selectorGroup}>
            <Car size={18} className={styles.selectorIcon} />
            <select value={selectedVehicle} onChange={(e) => setSelectedVehicle(e.target.value)} className={styles.selector}>
              {['AP 01 BB 5856', 'TS 09 CC 1234', 'MH 12 DD 5678'].map(v => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>

          <div className={styles.selectorGroup}>
            <Calendar size={18} className={styles.selectorIcon} />
            <input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)} 
              className={styles.selector}
            />
          </div>
          
          <div className={styles.selectorGroup}>
            <span className={styles.selectorLabel}>Alarm Type:</span>
            <select value={selectedAlert} onChange={(e) => setSelectedAlert(e.target.value)} className={styles.selector}>
              {ALERT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Deep Dive Visualization (The "Diff" View) */}
      <div className={styles.section}>
        <div className={styles.deepDiveGrid}>
          <div className={styles.mainVisualizationCard}>
            <div className={styles.cardHeader}>
              <div className={styles.iconCircle} style={{ background: activeAlertData.status === 'Alert' ? '#ee5d50' : '#1e5bd8' }}>
                {activeAlertData.icon}
              </div>
              <div>
                <h3 className={styles.vizTitle}>{selectedAlert}</h3>
                <span className={`${styles.statusBadge} ${activeAlertData.status === 'Alert' ? styles.statusAlert : styles.statusNormal}`}>
                  {activeAlertData.status}
                </span>
              </div>
            </div>

            <div className={styles.vizContent}>
              <div className={styles.diffContainer}>
                <div className={styles.diffBarWrapper}>
                  <div className={styles.diffLabel}>Current Performance</div>
                  <div className={styles.barGroup}>
                    <div className={styles.barBackground}>
                      <div 
                        className={styles.barFill} 
                        style={{ width: `${Math.min(activeAlertData.current, 100)}%`, background: isHigher ? '#ee5d50' : '#05cd99' }}
                      />
                    </div>
                    <span className={styles.barValue}>{activeAlertData.current}</span>
                  </div>
                </div>

                <div className={styles.diffBarWrapper}>
                  <div className={styles.diffLabel}>Healthy Average</div>
                  <div className={styles.barGroup}>
                    <div className={styles.barBackground}>
                      <div 
                        className={styles.barFill} 
                        style={{ width: `${Math.min(activeAlertData.average, 100)}%`, background: '#5C6A82' }}
                      />
                    </div>
                    <span className={styles.barValue}>{activeAlertData.average}</span>
                  </div>
                </div>
              </div>

              <div className={styles.diffMetric}>
                <div className={styles.metricIcon}>
                  {isHigher ? <TrendingUp color="#ee5d50" /> : <TrendingDown color="#05cd99" />}
                </div>
                <div>
                  <div className={styles.metricValue} style={{ color: isHigher ? '#ee5d50' : '#05cd99' }}>
                    {isHigher ? '+' : ''}{diff} units
                  </div>
                  <div className={styles.metricLabel}>Deviation from normal</div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.infoCard}>
            <h4 className={styles.infoTitle}>Analysis Summary</h4>
            <p className={styles.infoText}>
              The system detected <strong>{activeAlertData.current}</strong> instances of {selectedAlert} in the last 24 hours.
              This is <strong>{Math.abs(diff)} units {isHigher ? 'higher' : 'lower'}</strong> than the typical vehicle baseline.
            </p>
            <div className={styles.recommendationBox}>
              <strong>System Action:</strong> {activeAlertData.status === 'Alert' ? 'Escalated to technical supervisor.' : 'Routine monitoring continuing.'}
            </div>
          </div>
        </div>
      </div>

      {/* Full Health Board */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>System Health Board</h2>
          <span className={styles.boardCount}>{MOCK_DETAILED_ALERTS.length} Monitors Active</span>
        </div>
        <div className={styles.healthGrid}>
          {MOCK_DETAILED_ALERTS.map((alert) => (
            <div 
              key={alert.id} 
              className={`${styles.miniAlertCard} ${selectedAlert === alert.type ? styles.miniActive : ''}`}
              onClick={() => setSelectedAlert(alert.type)}
            >
              <div className={styles.miniIcon}>{alert.icon}</div>
              <div className={styles.miniInfo}>
                <span className={styles.miniType}>{alert.type}</span>
                <span className={`${styles.miniStatus} ${alert.status === 'Alert' ? styles.textAlert : ''}`}>
                  {alert.current}
                </span>
              </div>
              {alert.status === 'Alert' && <div className={styles.alertDot} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
