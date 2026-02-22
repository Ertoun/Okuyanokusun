import styles from './MoodPicker.module.css';
import { X } from 'lucide-react';

const MOODS = [
  { emoji: '🤩', label: 'Excited' },
  { emoji: '😎', label: 'Sunglasses' },
  { emoji: '😊', label: 'Happy' },
  { emoji: '😴', label: 'Tired' },
  { emoji: '🤯', label: 'Mind blown' },
  { emoji: '😩', label: 'Exhausted' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '❤️', label: 'Heart' },
  { emoji: '💔', label: 'Heartbroken' },
];

interface MoodPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (emoji: string, label: string) => void;
  currentEmoji?: string;
}

export default function MoodPicker({ isOpen, onClose, onSelect, currentEmoji }: MoodPickerProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
        <div className={styles.handle} />
        <div className={styles.header}>
          <h3 className={styles.title}>How are you feeling?</h3>
          <button className={styles.closeBtn} onClick={onClose}><X size={20} /></button>
        </div>
        <p className={styles.subtitle}>Your mood will be visible for 24 hours</p>
        <div className={styles.grid}>
          {MOODS.map(({ emoji, label }) => (
            <button
              key={emoji}
              className={`${styles.moodBtn} ${currentEmoji === emoji ? styles.selected : ''}`}
              onClick={() => { onSelect(emoji, label); onClose(); }}
            >
              <span className={styles.moodEmoji}>{emoji}</span>
              <span className={styles.moodLabel}>{label}</span>
            </button>
          ))}
        </div>
        {currentEmoji && (
          <button
            className={styles.clearBtn}
            onClick={() => { onSelect('', ''); onClose(); }}
          >
            Clear mood
          </button>
        )}
      </div>
    </div>
  );
}
