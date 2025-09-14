"use client";

import { useState, useEffect, RefObject } from "react";

/**
 * Custom hook to calculate horizontal drag for Framer Motion
 * Makes sure that draggable content can not be dragged beyond container
 * @param containerRef ref to visible viewport
 * @param contentRef   ref to draggable content inside ontainer
 * @returns { left, right } constraints for dragConstraints
 */

// nulling cause TypeScript shows error in Navbar if not
export const useDragConstraints = (
  containerRef: RefObject<HTMLDivElement | null>, // ref to the visible viewport
  contentRef: RefObject<HTMLDivElement | null> // ref to the draggable content inside the container
) => {
  const [dragConstraints, setDragConstraints] = useState({ right: 0, left: 0 }); // constraints for dragConstraints

  useEffect(() => {
    const calculateConstraints = () => {
      if (containerRef.current && contentRef.current) {
        // Width of viewport
        const containerWidth = containerRef.current.offsetWidth;
        // Total width of content
        const contentWidth = contentRef.current.scrollWidth;

        /**
         * If the content is wider than the container
         * dragging left up to overflow width is ok
         * the -16 is a padding/buffer to prevent clipping
         */

        const newLeftConstraint =
          contentWidth > containerWidth
            ? -(contentWidth - containerWidth) - 16
            : 0;
        // Right is always 0
        setDragConstraints({ right: 0, left: newLeftConstraint });
      }
    };
    // Run on mount
    calculateConstraints();

    // Recalculate on window resize
    window.addEventListener("resize", calculateConstraints);

    // Cleanup on unmount
    return () => window.removeEventListener("resize", calculateConstraints);
  }, [containerRef, contentRef]);

  return dragConstraints;
};
