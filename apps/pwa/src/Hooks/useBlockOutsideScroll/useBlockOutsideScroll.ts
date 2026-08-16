import { useEffect } from "react";

export const useBlockOutsideScroll = (
  ref: React.RefObject<HTMLElement | null>,
) => {
  useEffect(() => {
    const container = ref?.current;
    if (!container) return;

    const blockOutsideScroll = (event: Event) => {
      if (container.contains(event.target as Node)) return;
      event.preventDefault();
    };

    const options = { capture: true, passive: false } as const;
    document.addEventListener("wheel", blockOutsideScroll, options);
    document.addEventListener("touchmove", blockOutsideScroll, options);
    return () => {
      document.removeEventListener("wheel", blockOutsideScroll, options);
      document.removeEventListener("touchmove", blockOutsideScroll, options);
    };
  }, [ref]);
};
