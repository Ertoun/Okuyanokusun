import styles from './MoodBanner.module.css';

interface MoodData {
  user: string;
  emoji: string;
  label: string;
  expiresAt: string;
}

interface MoodBannerProps {
  moods: MoodData[];
}

export default function MoodBanner({ moods }: MoodBannerProps) {
  if (!moods || moods.length === 0) return null;

  return (
    <div className={styles.banner}>
      {['Sude', 'Ertan'].map(user => {
        const mood = moods.find(m => m.user === user && m.emoji);
        return (
          <div key={user} className={`${styles.card} ${mood ? styles.active : styles.empty}`}>
            <span className={styles.emoji}>{mood ? mood.emoji : '···'}</span>
            <div className={styles.info}>
              <span className={styles.name}>{user}</span>
              {mood && <span className={styles.label}>{mood.label}</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
