import { useEffect, useRef, useState } from 'react';

// Reveals `text` with a typewriter effect, driven by elapsed time (robust to
// re-renders). Clicking fast-forwards to the end. `instant` shows it at once.
export default function Typewriter({ text = '', instant = false, speed = 400, className = '' }) {
  const [count, setCount] = useState(instant ? text.length : 0);
  const timer = useRef(0);

  useEffect(() => {
    if (instant || !text) {
      setCount(text.length);
      return;
    }
    // Time-based reveal via setTimeout: smooth in a visible tab, and still
    // completes correctly if timers are throttled (e.g. a background tab),
    // because each tick computes progress from real elapsed time.
    const start = performance.now();
    setCount(0);
    const tick = () => {
      const chars = Math.min(text.length, Math.floor(((performance.now() - start) / 1000) * speed));
      setCount(chars);
      if (chars < text.length) timer.current = setTimeout(tick, 16);
    };
    tick();
    return () => clearTimeout(timer.current);
  }, [text, instant, speed]);

  const done = count >= text.length;

  return (
    <span
      className={className}
      onClick={() => {
        clearTimeout(timer.current);
        setCount(text.length);
      }}
    >
      {text.slice(0, count)}
      {!done && (
        <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-indigo-400 align-middle" />
      )}
    </span>
  );
}
