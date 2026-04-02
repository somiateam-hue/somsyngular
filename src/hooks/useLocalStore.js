// Generic localStorage hook
// Usage: const [data, setData] = useLocalStore('myKey', defaultValue)
import { useState } from 'react';

export function useLocalStore(key, defaultValue) {
  const [state, setState] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const setValue = (value) => {
    try {
      const next = typeof value === 'function' ? value(state) : value;
      localStorage.setItem(key, JSON.stringify(next));
      setState(next);
    } catch (e) {
      console.error('useLocalStore write error:', e);
    }
  };

  return [state, setValue];
}
