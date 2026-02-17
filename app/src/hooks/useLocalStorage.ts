'use client';

import { useState, useEffect, useCallback } from 'react';

type SetValue<T> = T | ((prev: T) => T);

/**
 * Custom hook for managing localStorage with type safety
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: SetValue<T>) => void, () => void] {
  // Get initial value from localStorage or use initialValue
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isInitialized, setIsInitialized] = useState(false);

  // Read from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
    }
    setIsInitialized(true);
  }, [key]);

  // Set value in localStorage
  const setValue = useCallback((value: SetValue<T>) => {
    try {
      // Allow value to be a function for same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);

      // Save to localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Remove value from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

/**
 * Hook specifically for boolean flags in localStorage
 */
export function useLocalStorageFlag(key: string, defaultValue = false): [boolean, () => void, () => void] {
  const [value, setValue, removeValue] = useLocalStorage(key, defaultValue);
  
  const enable = useCallback(() => setValue(true), [setValue]);
  const disable = useCallback(() => setValue(false), [setValue]);
  const toggle = useCallback(() => setValue(prev => !prev), [setValue]);
  
  // Return toggle as the setter for boolean
  return [value, toggle, removeValue];
}
