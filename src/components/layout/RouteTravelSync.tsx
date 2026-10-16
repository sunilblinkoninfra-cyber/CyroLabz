"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useStoryStore, getTargetChapterForPath } from "@/lib/storyStore";

export const RouteTravelSync: React.FC = () => {
  const pathname = usePathname();
  const travelTo = useStoryStore((state) => state.travelTo);
  const setTargetS = useStoryStore((state) => state.setTargetS);
  const prevPathRef = useRef<string>(pathname);

  useEffect(() => {
    // If not home page, set chapter target or tween to it
    if (pathname !== "/") {
      const targetChapter = getTargetChapterForPath(pathname);
      // If we just navigated from another page, tween s so the canvas visibly travels
      if (prevPathRef.current !== pathname) {
        travelTo(targetChapter, 850);
      } else {
        // Direct initial load: initialize s and targetS immediately to the chapter
        useStoryStore.getState().setS(targetChapter);
        setTargetS(targetChapter);
      }
    }
    prevPathRef.current = pathname;
  }, [pathname, travelTo, setTargetS]);

  return null;
};
