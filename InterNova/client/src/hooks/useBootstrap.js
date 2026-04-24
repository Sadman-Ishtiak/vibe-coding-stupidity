import { useEffect, useState } from 'react';

let bootstrapLoaded = false;
let bootstrapPromise = null;

/**
 * useBootstrap Hook
 * Ensures Bootstrap JavaScript is loaded
 * Professional MERN pattern for lazy loading dependencies
 */
export function useBootstrap() {
  const [loaded, setLoaded] = useState(bootstrapLoaded);

  useEffect(() => {
    if (bootstrapLoaded) {
      setLoaded(true);
      return;
    }

    if (!bootstrapPromise) {
      bootstrapPromise = import('bootstrap/dist/js/bootstrap.bundle.min.js')
        .then(() => {
          bootstrapLoaded = true;
          setLoaded(true);
        })
        .catch((error) => {
          console.error('Failed to load Bootstrap:', error);
          bootstrapPromise = null; // Reset to allow retry
        });
    } else {
      bootstrapPromise.then(() => setLoaded(true));
    }
  }, []);

  return loaded;
}
