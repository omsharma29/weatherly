import { useState, useEffect } from "react";

// Custom hook for debounce
export function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler); // cleanup on value change
  }, [value, delay]);

  return debouncedValue;
}