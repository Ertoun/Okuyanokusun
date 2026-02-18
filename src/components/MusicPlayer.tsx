"use client";

import styles from "./MusicPlayer.module.css";

interface MusicPlayerProps {
  src: string;
}

export default function MusicPlayer({ src }: MusicPlayerProps) {
  // Simple check for YouTube
  const getYoutubeEmbed = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const youtubeId = getYoutubeEmbed(src);
  const isSpotify = src.includes("spotify.com");

  if (youtubeId) {
    return (
      <div className={styles.container}>
        <iframe
          width="100%"
          height="160"
          src={`https://www.youtube.com/embed/${youtubeId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className={styles.iframe}
        ></iframe>
      </div>
    );
  }

  if (isSpotify) {
    // Convert open.spotify.com/track/ID to open.spotify.com/embed/track/ID
    const embedUrl = src.replace("open.spotify.com/", "open.spotify.com/embed/");
    return (
      <div className={styles.container}>
        <iframe
          src={embedUrl}
          width="100%"
          height="160"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          className={styles.iframe}
        ></iframe>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <audio controls src={src} className={styles.audio}>
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}
