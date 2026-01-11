import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for Intersection Observer (lazy loading, infinite scroll)
 * @param {Object} options - IntersectionObserver options
 */
export const useIntersectionObserver = (options = {}) => {
  const {
    threshold = 0,
    root = null,
    rootMargin = '0px',
    freezeOnceVisible = false,
  } = options;

  const [entry, setEntry] = useState(null);
  const elementRef = useRef(null);
  const frozen = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    const hasIOSupport = !!window.IntersectionObserver;

    if (!hasIOSupport || !element) return;

    if (frozen.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setEntry(entry);

        if (entry.isIntersecting && freezeOnceVisible) {
          frozen.current = true;
        }
      },
      { threshold, root, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, root, rootMargin, freezeOnceVisible]);

  return [elementRef, entry];
};
