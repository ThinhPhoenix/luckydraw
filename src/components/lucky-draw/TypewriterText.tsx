import { useEffect, useState } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number; // ms per character
  pauseOnLastChars?: number; // how many characters to pause before
  pauseDuration?: number; // ms to pause
  onComplete?: () => void;
  className?: string;
  showCursor?: boolean;
}

export function TypewriterText({
  text,
  speed = 80,
  pauseOnLastChars = 2,
  pauseDuration = 300,
  onComplete,
  className = '',
  showCursor = true,
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Reset when text changes
    setDisplayText('');
    setCurrentIndex(0);
    setIsPaused(false);
    setIsComplete(false);
  }, [text]);

  useEffect(() => {
    if (currentIndex >= text.length) {
      if (!isComplete) {
        setIsComplete(true);
        onComplete?.();
      }
      return;
    }

    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false);
        setCurrentIndex((prev) => prev + 1);
      }, pauseDuration);
      return () => clearTimeout(pauseTimer);
    }

    const isNearEnd = currentIndex >= text.length - pauseOnLastChars;
    const currentSpeed = isNearEnd ? pauseDuration : speed;

    const timer = setTimeout(() => {
      if (isNearEnd && currentIndex === text.length - pauseOnLastChars) {
        setIsPaused(true);
      } else {
        setCurrentIndex((prev) => prev + 1);
      }
    }, currentSpeed);

    return () => clearTimeout(timer);
  }, [
    currentIndex,
    text,
    speed,
    pauseOnLastChars,
    pauseDuration,
    isPaused,
    isComplete,
    onComplete,
  ]);

  useEffect(() => {
    setDisplayText(text.slice(0, currentIndex));
  }, [currentIndex, text]);

  return (
    <span className={className}>
      {displayText}
      {showCursor && !isComplete && (
        <span className="animate-pulse text-tet-gold">|</span>
      )}
    </span>
  );
}
