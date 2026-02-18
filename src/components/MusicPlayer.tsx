"use client";

import styles from "./MusicPlayer.module.css";

interface MusicPlayerProps {
  src: string;
}

export default function MusicPlayer({ src }: MusicPlayerProps) {
  return (
    <div className={styles.container}>
      <audio controls src={src} className={styles.audio}>
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
