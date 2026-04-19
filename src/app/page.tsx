'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './page.module.css';
import { 
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
  TrendingUp,
  TrendingDown,
  Loader,
  RefreshCw,
  Wifi,
  WifiOff,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Vehicle {
  terid: string;
  vehicleNumber: string;
}

interface AlarmType {
  typeId: number;
  name: string;
}

interface AlertCard {
  id: number;
  typeId: number;
  type: string;
  count: number;
  status: 'Alert' | 'Normal';
  icon: React.ReactNode;
}

// ─── Icon resolver ────────────────────────────────────────────────────────────

function getAlarmIcon(name: string) {
  if (name.includes('Video'))      return <VideoOff size={20} />;
  if (name.includes('Motion'))     return <Activity size={20} />;
  if (name.includes('Camera'))     return <EyeOff size={20} />;
  if (name.includes('storage'))    return <Database size={20} />;
  if (name.includes('IO'))         return <Zap size={20} />;
  if (name.includes('Emergency'))  return <BellRing size={20} />;
  if (name.includes('High-speed')) return <Gauge size={20} />;
  if (name.includes('voltage'))    return <BatteryLow size={20} />;
  if (name.includes('Accel'))      return <FastForward size={20} />;
  if (name.includes('Geo'))        return <MapPin size={20} />;
  if (name.includes('shutdown'))   return <PowerOff size={20} />;
  if (name.includes('Temp'))       return <Thermometer size={20} />;
  return <Ruler size={20} />;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [alarmTypes, setAlarmTypes] = useState<AlarmType[]>([]);
  const [selectedVehicleNumber, setSelectedVehicleNumber] = useState('');
  const [selectedDate, setSelectedDate] = useState(() =>
    new Date().toISOString().split('T')[0],
  );
  const [selectedAlarmName, setSelectedAlarmName] = useState('');
  const [alertCards, setAlertCards] = useState<AlertCard[]>([]);
  const [liveCount, setLiveCount] = useState<number | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [backendError, setBackendError] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── 1. Load vehicle list + alarm types on mount ──────────────────────────
  useEffect(() => {
    Promise.all([
      fetch('http://localhost:3001/alerts/vehicles'),
      fetch('http://localhost:3001/alerts/alarm-types'),
    ])
      .then(async ([vRes, aRes]) => {
        if (!vRes.ok || !aRes.ok) throw new Error('Backend not ready');
        const vehicleData: Vehicle[] = await vRes.json();
        const alarmData: AlarmType[] = await aRes.json();

        setBackendError(false);
        setVehicles(vehicleData);
        setAlarmTypes(alarmData);

        const cards: AlertCard[] = alarmData.map((a, i) => ({
          id: i,
          typeId: a.typeId,
          type: a.name,
          count: 0,
          status: 'Normal',
          icon: getAlarmIcon(a.name),
        }));
        setAlertCards(cards);

        if (vehicleData.length > 0) setSelectedVehicleNumber(vehicleData[0].vehicleNumber);
        if (alarmData.length > 0)   setSelectedAlarmName(alarmData[0].name);
      })
      .catch(() => setBackendError(true));
  }, []);

  // ── 2. Fetch count from backend → external API ───────────────────────────
  const fetchCount = useCallback(
    async (vehicleNumber: string, alarmName: string, date: string) => {
      if (!vehicleNumber || !alarmName || !date) return;
      setIsFetching(true);
      try {
        const res = await fetch('http://localhost:3001/alerts/count', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vehicleNumber, alarmName, date }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setLiveCount(data.count);
        setLastUpdated(new Date());
        setBackendError(false);
        setAlertCards(prev =>
          prev.map(c =>
            c.type === alarmName
              ? { ...c, count: data.count, status: data.count > 0 ? 'Alert' : 'Normal' }
              : c,
          ),
        );
      } catch {
        setLiveCount(null);
        setBackendError(true);
      } finally {
        setIsFetching(false);
      }
    },
    [],
  );

  // ── 3. Auto-poll every 30s when date is today ────────────────────────────
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const live = selectedDate === today;
    setIsLive(live);

    if (pollRef.current) clearInterval(pollRef.current);
    fetchCount(selectedVehicleNumber, selectedAlarmName, selectedDate);

    if (live && selectedVehicleNumber && selectedAlarmName) {
      pollRef.current = setInterval(
        () => fetchCount(selectedVehicleNumber, selectedAlarmName, selectedDate),
        30_000,
      );
    }
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [selectedVehicleNumber, selectedAlarmName, selectedDate, fetchCount]);

  // ── Derived values ────────────────────────────────────────────────────────
  const activeCard = alertCards.find(c => c.type === selectedAlarmName) ?? alertCards[0];
  const displayCount = liveCount ?? activeCard?.count ?? 0;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className={styles.container}>

      {/* Backend offline banner */}
      {backendError && (
        <div style={{
          background: '#fee2e2', color: '#b91c1c', padding: '10px 16px',
          borderRadius: 10, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8,
          fontSize: 14, fontWeight: 600,
        }}>
          <WifiOff size={16} />
          Cannot reach backend (localhost:3001). Make sure NestJS is running with <code>npm run start:dev</code> inside the <code>backend/</code> folder.
        </div>
      )}

      {/* ── Filter bar ──────────────────────────────────────────────────── */}
      <div className={styles.filterSection}>
        <div className={styles.selectors}>

          {/* Vehicle dropdown */}
          <div className={styles.selectorGroup}>
            <Car size={18} className={styles.selectorIcon} />
            <select
              value={selectedVehicleNumber}
              onChange={e => setSelectedVehicleNumber(e.target.value)}
              className={styles.selector}
            >
              {vehicles.length === 0
                ? <option>Loading…</option>
                : vehicles.map(v => (
                    <option key={v.terid} value={v.vehicleNumber}>{v.vehicleNumber}</option>
                  ))
              }
            </select>
          </div>

          {/* Date picker */}
          <div className={styles.selectorGroup}>
            <Calendar size={18} className={styles.selectorIcon} />
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className={styles.selector}
            />
          </div>

          {/* Alarm type dropdown */}
          <div className={styles.selectorGroup}>
            <span className={styles.selectorLabel}>Alarm Type:</span>
            <select
              value={selectedAlarmName}
              onChange={e => setSelectedAlarmName(e.target.value)}
              className={styles.selector}
            >
              {alarmTypes.map(t => (
                <option key={t.typeId} value={t.name}>{t.name}</option>
              ))}
            </select>
          </div>


        </div>
      </div>

      {/* Last updated timestamp */}
      {lastUpdated && (
        <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 8, paddingLeft: 4 }}>
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      )}

      {/* ── Deep Dive ───────────────────────────────────────────────────── */}
      <div className={styles.section}>
        <div className={styles.deepDiveGrid}>

          {/* Main count card */}
          <div className={styles.mainVisualizationCard}>
            <div className={styles.cardHeader}>
              <div
                className={styles.iconCircle}
                style={{ background: displayCount > 0 ? '#ee5d50' : '#1e5bd8' }}
              >
                {activeCard?.icon}
              </div>
              <div>
                <h3 className={styles.vizTitle}>{selectedAlarmName || 'Select an alarm'}</h3>
                <span className={`${styles.statusBadge} ${
                  displayCount > 0 ? styles.statusAlert : styles.statusNormal
                }`}>
                  {isFetching ? 'Fetching…' : displayCount > 0 ? 'Alert' : 'Normal'}
                </span>
              </div>
            </div>

            <div className={styles.vizContent}>
              <div className={styles.diffContainer}>
                <div className={styles.diffBarWrapper}>
                  <div className={styles.diffLabel}>
                    {isFetching
                      ? <span style={{ display:'flex', alignItems:'center', gap:6 }}>
                          <Loader size={14} style={{ animation:'spin 1s linear infinite' }} />
                          Fetching from Masstrans API…
                        </span>
                      : `Count for ${selectedDate} — vehicle ${selectedVehicleNumber}`
                    }
                  </div>
                  <div className={styles.barGroup}>
                    <div className={styles.barBackground}>
                      <div
                        className={styles.barFill}
                        style={{
                          width: `${Math.min(displayCount * 2, 100)}%`,
                          background: displayCount > 0 ? '#ee5d50' : '#05cd99',
                          transition: 'width 0.6s ease',
                        }}
                      />
                    </div>
                    <span className={styles.barValue} style={{ fontSize: 22, fontWeight: 700 }}>
                      {isFetching ? '…' : displayCount}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.diffMetric}>
                <div className={styles.metricIcon}>
                  {displayCount > 0
                    ? <TrendingUp color="#ee5d50" />
                    : <TrendingDown color="#05cd99" />
                  }
                </div>
                <div>
                  <div className={styles.metricValue} style={{ color: displayCount > 0 ? '#ee5d50' : '#05cd99' }}>
                    {displayCount} alarm{displayCount !== 1 ? 's' : ''}
                  </div>
                  <div className={styles.metricLabel}>recorded on {selectedDate}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Summary */}
          <div className={styles.infoCard}>
            <h4 className={styles.infoTitle}>Analysis Summary</h4>
            <p className={styles.infoText}>
              For vehicle <strong>{selectedVehicleNumber || '—'}</strong>, the system detected{' '}
              <strong>{displayCount}</strong> instance{displayCount !== 1 ? 's' : ''} of{' '}
              <strong>{selectedAlarmName}</strong> on <strong>{selectedDate}</strong>.
            </p>
            <div className={styles.recommendationBox}>
              <strong>System Action:</strong>{' '}
              {displayCount > 0
                ? 'Escalated to technical supervisor.'
                : 'Routine monitoring continuing.'}
            </div>
            <div className={styles.recommendationBox} style={{
              marginTop: 8, background: 'rgba(30,91,216,0.08)', borderColor: '#1e5bd8',
            }}>
              <strong>Data Source:</strong>{' '}
              {backendError ? '⚠️ Backend offline' : '✅ Live — Masstrans API'}
            </div>
          </div>
        </div>
      </div>

      {/* ── System Health Board ─────────────────────────────────────────── */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>System Health Board</h2>
          <span className={styles.boardCount}>{alertCards.length} Monitors Active</span>
        </div>
        <div className={styles.healthGrid}>
          {alertCards.map(alert => (
            <div
              key={alert.id}
              className={`${styles.miniAlertCard} ${
                selectedAlarmName === alert.type ? styles.miniActive : ''
              }`}
              onClick={() => setSelectedAlarmName(alert.type)}
            >
              <div className={styles.miniIcon}>{alert.icon}</div>
              <div className={styles.miniInfo}>
                <span className={styles.miniType}>{alert.type}</span>
                <span className={`${styles.miniStatus} ${alert.count > 0 ? styles.textAlert : ''}`}>
                  {selectedAlarmName === alert.type && isFetching ? '…' : alert.count}
                </span>
              </div>
              {alert.count > 0 && <div className={styles.alertDot} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
