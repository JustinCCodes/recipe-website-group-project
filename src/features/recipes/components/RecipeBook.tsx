"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Recipe, Ingredient, InstructionStep } from "@/generated/prisma";

type Slide =
  | { type: "cover"; recipe: Recipe }
  | { type: "ingredient"; ingredient: Ingredient }
  | { type: "step"; step: InstructionStep };

interface PictureProps {
  recipe: Recipe & {
    ingredients: Ingredient[];
    instructionSteps: InstructionStep[];
  };
  disableSwipe?: boolean;
}

const variants = {
  enter: (direction: number) => ({ x: direction > 0 ? "100%" : "-100%" }),
  center: { zIndex: 1, x: 0 },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? "100%" : "-100%",
  }),
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) =>
  Math.abs(offset) * velocity;

export default function RecipeBook({ recipe, disableSwipe }: PictureProps) {
  const [[page, direction], setPage] = useState([0, 0]);

  const slides: Slide[] = useMemo(
    () => [
      { type: "cover" as const, recipe },
      ...recipe.ingredients.map((ing) => ({
        type: "ingredient" as const,
        ingredient: ing,
      })),
      ...recipe.instructionSteps.map((step) => ({
        type: "step" as const,
        step: step,
      })),
    ],
    [recipe]
  );

  const activeIndex = page;
  const activeSlide = slides[activeIndex];

  const paginate = (newDirection: number) => {
    const newPage = page + newDirection;
    if (newPage >= 0 && newPage < slides.length) {
      setPage([newPage, newDirection]);
    }
  };

  return (
    <section className="h-full w-full relative flex flex-col justify-center items-center overflow-hidden">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={page}
          className="absolute w-full h-full"
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
          }}
          drag={disableSwipe ? false : "x"}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          // Locks gesture to horizontal axis
          dragDirectionLock
          onDragEnd={(e, { offset, velocity }) => {
            if (disableSwipe) return;
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold) paginate(1);
            else if (swipe > swipeConfidenceThreshold) paginate(-1);
          }}
        >
          {activeSlide.type === "cover" && (
            <div className="w-full h-full bg-base-300 flex flex-col justify-center items-center p-8 text-center">
              <img
                src={recipe.mediaUrl}
                alt={recipe.name}
                className="absolute inset-0 w-full h-full object-cover opacity-30"
              />
              <div className="relative z-10">
                <h1 className="text-4xl font-bold">{recipe.name}</h1>
                <p className="mt-4 text-lg">{recipe.description}</p>
                <p className="mt-8 text-sm opacity-70">
                  Swipe left to begin experience, or pull down for standard
                  view.
                </p>
              </div>
            </div>
          )}
          {activeSlide.type === "ingredient" && (
            <div className="w-full h-full">
              <img
                src={activeSlide.ingredient.imageUrl || undefined}
                alt={activeSlide.ingredient.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-1/4 left-4 right-4 bg-black/50 text-white p-3 rounded">
                <h3 className="font-semibold">{activeSlide.ingredient.name}</h3>
                <p className="text-sm opacity-90">
                  {activeSlide.ingredient.amount}
                </p>
              </div>
            </div>
          )}
          {activeSlide.type === "step" && (
            <div className="w-full h-full">
              <video
                src={activeSlide.step.mediaUrl || undefined}
                muted
                autoPlay
                loop
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-1/4 left-4 right-4 bg-black/50 text-white p-3 rounded">
                <h3 className="font-semibold">{activeSlide.step.text}</h3>
                <p className="text-sm opacity-90">
                  Step {activeSlide.step.stepNumber}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Slide Indicator Dots */}
      <div className="absolute bottom-6 flex justify-center gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setPage([i, i > activeIndex ? 1 : -1])}
            className={`h-2 w-2 rounded-full transition-colors ${
              i === activeIndex ? "bg-white" : "bg-white/50"
            }`}
            disabled={disableSwipe}
          />
        ))}
      </div>
    </section>
  );
}
