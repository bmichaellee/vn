import { useEffect } from "react";

export const useFocusTrap = (
  ref: React.RefObject<HTMLElement | null> | null,
) => {
  useEffect(() => {
    if (!ref) return;
    const container = ref.current;
    if (!container) return;

    const trapFocus = (event: FocusEvent) => {
      if (!container.contains(event.target as Node)) {
        container.focus();
      }
    };

    document.addEventListener("focusin", trapFocus);
    return () => document.removeEventListener("focusin", trapFocus);
  }, [ref]);
};
