"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Mounts its children only once the wrapper is near the viewport, and keeps
 * them mounted after that (`once`). Used to defer heavy client-only work —
 * WebGL canvases in particular — until they're actually about to be seen.
 */
export default function LazyMount({
  children,
  fallback = null,
  rootMargin = "200px",
  className,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} className={className}>
      {visible ? children : fallback}
    </div>
  );
}
