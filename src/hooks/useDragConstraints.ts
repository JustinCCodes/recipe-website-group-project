"use client";

import { useState, useEffect, RefObject } from "react";

// nulling cause TypeScript shows error in Navbar if not
export const useDragConstraints = (
  containerRef: RefObject<HTMLDivElement | null>,
  contentRef: RefObject<HTMLDivElement | null>
) => {
  const [dragConstraints, setDragConstraints] = useState({ right: 0, left: 0 });

  useEffect(() => {
    const calculateConstraints = () => {
      if (containerRef.current && contentRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const contentWidth = contentRef.current.scrollWidth;

        const newLeftConstraint =
          contentWidth > containerWidth
            ? -(contentWidth - containerWidth) - 16
            : 0;

        setDragConstraints({ right: 0, left: newLeftConstraint });
      }
    };

    calculateConstraints();
    window.addEventListener("resize", calculateConstraints);

    // Cleanup
    return () => window.removeEventListener("resize", calculateConstraints);
  }, [containerRef, contentRef]);

  return dragConstraints;
};
