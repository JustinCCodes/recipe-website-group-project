// prisma/seed.ts

import { PrismaClient } from "../src/generated/prisma";
import recipesData from "./recipes.json";

const prisma = new PrismaClient();

const categories = [
  "Appetizer",
  "Main Course",
  "Dessert",
  "Side Dish",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snack",
  "Drink",
  "Italian",
  "Mexican",
  "Chinese",
  "Indian",
  "Japanese",
  "Thai",
  "French",
  "Greek",
  "Spanish",
  "Mediterranean",
  "Vegan",
  "Vegetarian",
  "Gluten-Free",
  "Keto",
  "Low-Carb",
  "Dairy-Free",
  "Chicken",
  "Beef",
  "Pork",
  "Fish",
  "Seafood",
  "Pasta",
  "Rice",
  "Salad",
  "Soup",
  "Baking",
  "Grilling",
  "Frying",
  "Roasting",
  "Slow Cooker",
  "Instant Pot",
  "Holiday",
  "Party",
  "Quick & Easy",
  "Healthy",
  "Comfort Food",
  "Viral",
  "Fast Food",
];

async function main() {
  // --- Seed Categories ---
  console.log(`Start seeding categories ...`);
  for (const categoryName of categories) {
    await prisma.category.upsert({
      where: { name: categoryName },
      update: {},
      create: { name: categoryName },
    });
  }
  console.log(`Seeding categories finished.`);

  // --- Seed Recipes ---
  console.log(`\nStart seeding recipes...`);
  for (const recipe of recipesData) {
    console.log(`[DEBUG] Trying to seed recipe: "${recipe.name}"`);
    console.log(`[DEBUG] Searching for category: "${recipe.category_name}"`);

    const category = await prisma.category.findUnique({
      where: { name: recipe.category_name },
    });

    console.log(`[DEBUG] Found category object:`, category);

    if (!category) {
      console.warn(
        `[WARN] Category '${recipe.category_name}' NOT FOUND for recipe '${recipe.name}'. Skipping.`
      );
      continue;
    }

    await prisma.recipe.create({
      data: {
        name: recipe.name,
        description: recipe.description,
        mediaUrl: recipe.mediaUrl,
        mediaType: recipe.mediaType,
        durationSec: recipe.durationSec,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        categoryId: category.id,
        ingredients: {
          create: recipe.ingredients,
        },
        instructionSteps: {
          create: recipe.instructionSteps,
        },
      },
    });
    console.log(`✅ Created recipe: ${recipe.name}`);
  }
  console.log(`\nSeeding recipes finished.`);
}

main()
  .catch((e) => {
    console.error("An error occurred during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    console.log("Disconnecting Prisma Client...");
    await prisma.$disconnect();
  });
