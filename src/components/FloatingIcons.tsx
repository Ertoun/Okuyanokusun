import { useMemo } from "react";
import styles from "./FloatingIcons.module.css";

// Number of floating icons spawned
const ICON_COUNT = 64;

// Seeded deterministic pseudo-random so SSR/hydration is stable
function pseudoRand(seed: number) {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
}

// Light/dark paired SVG variants — one is picked randomly per icon
const VARIANTS = [
  { light: "/uploads/favicon-no-star-light-no-bg.svg", dark: "/uploads/favicon-no-star-dark-no-bg.svg" },
  { light: "/uploads/favicon-star-only-light.svg",     dark: "/uploads/favicon-star-only-dark.svg"     },
];

interface IconConfig {
  id: number;
  size: number;          // px
  startX: number;       // vw
  startY: number;       // vh
  duration: number;     // seconds
  delay: number;        // seconds (negative = already mid-flight on load)
  rotate: number;       // deg — fixed tilt at spawn, never changes
  variant: number;      // index into VARIANTS
}

function buildConfigs(): IconConfig[] {
  return Array.from({ length: ICON_COUNT }, (_, i) => ({
    id: i,
    size:     10 + pseudoRand(i * 3)      * 52,  // icon size in px → min 12px, max 64px
    startX:   pseudoRand(i * 1)           * 100, // horizontal spawn position → 0–100vw 
    startY:   pseudoRand(i * 11)          * 110, // vertical spawn position   → 0–110vh (can start off-screen bottom)
    duration: 32 + pseudoRand(i * 5)     * 22,  // how long one full pass takes → 32–54s (higher = slower drift)
    delay:   -(pseudoRand(i * 13)        * 30), // negative = icon starts mid-flight on page load (so screen isn't empty at first)
    rotate:   pseudoRand(i * 23) > 0.35
                ? Math.round((pseudoRand(i * 29) - 0.5) * 160)
                : 0,
    variant:  pseudoRand(i * 31) < 0.5 ? 0 : 1,  // randomly pick a SVG pair
  }));
}

export default function FloatingIcons() {
  const configs = useMemo(buildConfigs, []);

  return (
    <div className={styles.canvas} aria-hidden="true">
      {configs.map((cfg) => {
        const { light, dark } = VARIANTS[cfg.variant];
        return (
          <span
            key={cfg.id}
            className={styles.icon}
            style={{
              width:  cfg.size,
              height: cfg.size,
              left:   `${cfg.startX}vw`,
              bottom: `${cfg.startY}vh`,
              animationDuration: `${cfg.duration}s`,
              animationDelay:    `${cfg.delay}s`,
              ['--rot' as string]: `${cfg.rotate}deg`,
            } as React.CSSProperties}
          >
            <img src={light} alt="" className={`${styles.img} ${styles.lightImg}`} width={cfg.size} height={cfg.size} draggable={false} />
            <img src={dark}  alt="" className={`${styles.img} ${styles.darkImg}`}  width={cfg.size} height={cfg.size} draggable={false} />
          </span>
        );
      })}
    </div>
  );
}
