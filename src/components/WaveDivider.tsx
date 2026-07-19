import './WaveDivider.css';
import type { ReactElement } from 'react';

interface WaveDividerProps {
  /** Color of the wave fill */
  color?: string;
  /** Whether the wave is flipped (bottom of section) */
  flip?: boolean;
  /** Which wave variant to use */
  variant?: 'wave1' | 'wave2' | 'wave3';
  /** Additional CSS class */
  className?: string;
}

export default function WaveDivider({
  color = 'var(--color-bg-white)',
  flip = false,
  variant = 'wave1',
  className = '',
}: WaveDividerProps) {
  const waves: Record<string, ReactElement> = {
    wave1: (
      <svg
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z"
          fill={color}
        />
      </svg>
    ),
    wave2: (
      <svg
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M0,40 C180,100 360,0 540,50 C720,100 900,20 1080,60 C1260,100 1350,40 1440,50 L1440,120 L0,120 Z"
          fill={color}
        />
      </svg>
    ),
    wave3: (
      <svg
        viewBox="0 0 1440 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M0,50 Q360,100 720,50 T1440,50 L1440,100 L0,100 Z"
          fill={color}
        />
      </svg>
    ),
  };

  return (
    <div
      className={`wave-divider ${flip ? 'wave-divider-flip' : ''} ${className}`}
      aria-hidden="true"
    >
      {waves[variant]}
    </div>
  );
}
