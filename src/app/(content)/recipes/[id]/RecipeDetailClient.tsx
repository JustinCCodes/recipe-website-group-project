"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import RecipeBook from "@/features/recipes/components/RecipeBook";
import RecipeStandardView from "@/features/recipes/components/RecipeStandardView";

export default function RecipeDetailClient({ recipe }: { recipe: any }) {
  const [showOverlay, setShowOverlay] = React.useState(false);

  return (
    <div className="relative h-screen w-full bg-black overflow-hidden">
      {/* Motion.div wraps the RecipeBook and listens for vertical
          "swipe down to open" gesture */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ bottom: 0.5 }}
        dragDirectionLock // Locks vertical if it starts vertically
        onDragEnd={(event, info) => {
          // If user swipes down more than 100 pixels show overlay
          if (info.offset.y > 100 && !showOverlay) {
            setShowOverlay(true);
          }
        }}
        // Animate background to scale down when overlay is open
        animate={{
          scale: showOverlay ? 0.9 : 1,
          opacity: showOverlay ? 0.6 : 1,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="h-full"
      >
        <RecipeBook recipe={recipe} disableSwipe={showOverlay} />
      </motion.div>

      {/* AnimatePresence handles smooth entry and exit of overlay */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            key="overlay"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            // Drag up to close overlay
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.2 }}
            dragDirectionLock
            onDragEnd={(event, info) => {
              // If user swipes up more than 100 pixels close the overlay
              if (info.offset.y < -100) {
                setShowOverlay(false);
              }
            }}
            className="fixed inset-0 z-30 bg-base-100/90 backdrop-blur-md flex flex-col h-full w-full cursor-grab"
          >
            {/* Handle in the middle of the overlay as a visual cue */}
            <div className="absolute top-0 left-0 right-0 flex justify-center p-4">
              <div className="w-20 h-1.5 rounded-full bg-base-content/20"></div>
            </div>

            {/* The scrollable content */}
            <div className="flex-1 overflow-y-auto pt-8">
              <RecipeStandardView recipe={recipe} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
