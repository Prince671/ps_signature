import { createElement, Suspense, useEffect, useRef, useState } from 'react';

export default function DeferredSection({ id, component: LazyComponent, className = 'min-h-[60vh]' }) {
  const sectionRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return undefined;

    if (!('IntersectionObserver' in window)) {
      setShouldLoad(true);
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShouldLoad(true);
        observer.disconnect();
      }
    }, { rootMargin: '800px 0px' });

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div id={id} ref={sectionRef} className={className} aria-busy={!shouldLoad}>
      {shouldLoad ? (
        <Suspense fallback={<div className="min-h-[60vh]" aria-hidden="true" />}>
          {createElement(LazyComponent)}
        </Suspense>
      ) : (
        <div className="min-h-[60vh]" aria-hidden="true" />
      )}
    </div>
  );
}
