import { useEffect } from "react";

export const useBlockOutsideClicks = (
  ref: React.RefObject<HTMLElement | null>,
) => {
  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const blockOutsideClicks = (event: MouseEvent) => {
      if (!container.contains(event.target as Node)) {
        event.stopPropagation();
        event.preventDefault();
      }
    };

    document.addEventListener("click", blockOutsideClicks, true);
    return () =>
      document.removeEventListener("click", blockOutsideClicks, true);
  }, [ref]);
};
