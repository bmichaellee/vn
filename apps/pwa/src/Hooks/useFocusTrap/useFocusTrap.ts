import { useEffect } from "react";

export const useFocusTrap = (
  ref: React.RefObject<HTMLElement | null>,
) => {
  useEffect(() => {
    const container = ref?.current;
    if (!container) return;

    const trapFocus = (event: FocusEvent) => {
      if (container.contains(event.target as Node)) return;
      container.focus();
    };

    document.addEventListener("focusin", trapFocus);
    return () => document.removeEventListener("focusin", trapFocus);
  }, [ref]);
};
