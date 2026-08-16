import { useEffect, useState } from "react";

export const usePresence = (active: boolean, durationMs: number) => {
  const [mounted, setMounted] = useState(active);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (active) {
      setMounted(true);
      const frame = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(frame);
    }

    setVisible(false);
    const unmountTimeout = setTimeout(() => setMounted(false), durationMs);
    return () => clearTimeout(unmountTimeout);
  }, [active, durationMs]);

  return { mounted, visible };
};
