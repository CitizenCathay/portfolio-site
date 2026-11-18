import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

// Full-screen image viewer over a dimmed, blurred backdrop.
// Rendered into <body> so transformed ancestors (reveal animations) can't trap the fixed overlay.
export default function Lightbox({ images, index, title, onClose, onIndex }) {
  const open = index !== null;
  const closeRef = useRef(null);
  const count = images.length;

  useEffect(() => {
    if (!open) return;
    const prevFocus = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight' && count > 1) onIndex((index + 1) % count);
      else if (e.key === 'ArrowLeft' && count > 1) onIndex((index - 1 + count) % count);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus?.({ preventScroll: true });
    };
  }, [open, index, count, onClose, onIndex]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} screenshot ${index + 1} of ${count}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <motion.figure
            className="lightbox__figure"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={index}
                src={images[index]}
                alt={`${title} screenshot ${index + 1}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              />
            </AnimatePresence>
            <figcaption className="lightbox__caption">
              <span>{title}</span>
              {count > 1 && <span className="mono">{index + 1} / {count}</span>}
            </figcaption>
          </motion.figure>

          <button ref={closeRef} className="lightbox__btn lightbox__close" aria-label="Close" onClick={onClose}>
            <X />
          </button>
          {count > 1 && (
            <>
              <button
                className="lightbox__btn lightbox__nav lightbox__nav--prev"
                aria-label="Previous screenshot"
                onClick={(e) => { e.stopPropagation(); onIndex((index - 1 + count) % count); }}
              >
                <ChevronLeft />
              </button>
              <button
                className="lightbox__btn lightbox__nav lightbox__nav--next"
                aria-label="Next screenshot"
                onClick={(e) => { e.stopPropagation(); onIndex((index + 1) % count); }}
              >
                <ChevronRight />
              </button>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
