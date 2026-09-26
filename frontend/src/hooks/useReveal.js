import { useEffect, useRef, useState } from "react";

/**
 * Returns a ref to attach to an element and a boolean that flips to true
 * once the element enters the viewport. Uses IntersectionObserver so
 * work only happens for sections the user actually scrolls to.
 */
export function useReveal(options = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px", ...options }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return [ref, isVisible];
}
