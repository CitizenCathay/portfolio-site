import { useEffect, useRef } from 'react';

// Mounts a sketch on a canvas and only runs it while it's on screen.
// `create(canvas)` must return { start, stop, destroy } or null if unsupported.
export function useSketch(create, onUnsupported) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const sketch = create(canvas);
    if (!sketch) { onUnsupported?.(); return; }

    let inView = false;
    const sync = () => (inView && !document.hidden ? sketch.start() : sketch.stop());
    const io = new IntersectionObserver(
      ([entry]) => { inView = entry.isIntersecting; sync(); },
      { rootMargin: '100px' },
    );
    io.observe(canvas);
    const onVis = sync;
    document.addEventListener('visibilitychange', onVis);

    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      sketch.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}
