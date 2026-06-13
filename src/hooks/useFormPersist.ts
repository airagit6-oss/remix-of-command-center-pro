import { useEffect, useRef, useState } from 'react';

interface UsFormPersistOptions {
  key: string;
  onRestore?: () => void;
}

/**
 * Hook for persisting form state to localStorage
 * Automatically saves form changes and restores on page reload
 */
export function useFormPersist<T>(
  initialState: T,
  options: UsFormPersistOptions
) {
  const { key, onRestore } = options;
  const [state, setState] = useState<T>(() => {
    // Try to restore from localStorage on mount
    try {
      const saved = localStorage.getItem(`form:${key}`);
      if (saved) {
        console.log(`[useFormPersist] Restored ${key} from cache`);
        return JSON.parse(saved);
      }
    } catch (error) {
      console.error(`[useFormPersist] Failed to restore ${key}:`, error);
    }
    return initialState;
  });

  const [hasSavedState, setHasSavedState] = useState(() => {
    try {
      return localStorage.getItem(`form:${key}`) !== null;
    } catch {
      return false;
    }
  });

  const isRestoringRef = useRef(false);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(`form:${key}`, JSON.stringify(state));
    } catch (error) {
      console.error(`[useFormPersist] Failed to save ${key}:`, error);
    }
  }, [state, key]);

  // Check for saved state on mount
  useEffect(() => {
    if (hasSavedState && !isRestoringRef.current) {
      isRestoringRef.current = true;
      onRestore?.();
    }
  }, [hasSavedState, onRestore]);

  const updateState = (updates: Partial<T>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const clearState = () => {
    try {
      localStorage.removeItem(`form:${key}`);
      setState(initialState);
      setHasSavedState(false);
    } catch (error) {
      console.error(`[useFormPersist] Failed to clear ${key}:`, error);
    }
  };

  const resetState = () => {
    setState(initialState);
  };

  return {
    state,
    setState,
    updateState,
    clearState,
    resetState,
    hasSavedState,
  };
}

/**
 * Hook for confirming restoration of saved form state
 * Shows toast asking user if they want to restore
 */
export function useFormRestorePrompt(formKey: string) {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(`form:${formKey}`);
      if (saved) {
        setShowPrompt(true);
      }
    } catch (error) {
      console.error('[useFormRestorePrompt] Error:', error);
    }
  }, [formKey]);

  const acceptRestore = () => {
    setShowPrompt(false);
  };

  const rejectRestore = () => {
    try {
      localStorage.removeItem(`form:${formKey}`);
    } catch (error) {
      console.error('[useFormRestorePrompt] Error clearing:', error);
    }
    setShowPrompt(false);
  };

  return {
    showPrompt,
    acceptRestore,
    rejectRestore,
  };
}
