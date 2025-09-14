import { prisma } from "@/lib/prisma";
import recipesData from "./recipes.json";

async function main() {
  console.log(`Start seeding ...`);

  for (const recipe of recipesData) {
    await prisma.recipe.create({
      data: {
        name: recipe.name,
        description: recipe.description,
        prepTime: recipe.prepTime,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        category: recipe.category,
        mediaUrl: recipe.imageUrl,
        mediaType: "gif",

        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
      },
    });
    console.log(`Created recipe with name: ${recipe.name}`);
  }

  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
