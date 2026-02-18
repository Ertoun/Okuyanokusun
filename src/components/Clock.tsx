import { useState, useEffect } from 'react';
import styles from './Clock.module.css';

export default function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.clock}>
      <span className={styles.time}>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      <span className={styles.date}>{time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}</span>
    </div>
  );
}
