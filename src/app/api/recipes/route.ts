import { PrismaClient } from "@/generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const recipes = await prisma.recipe.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(recipes);
  } catch (error) {
    console.error("Failed to fetch recipes:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data.name || !data.ingredients || !data.instructions) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    const newRecipe = await prisma.recipe.create({
      data: {
        name: data.name,
        description: data.description,
        prepTime: data.prepTime,
        cookTime: data.cookTime,
        servings: data.servings,
        category: data.category,
        imageUrl: data.imageUrl,
        ingredients: data.ingredients,
        instructions: data.instructions,
      },
    });

    return NextResponse.json(newRecipe, { status: 201 });
  } catch (error) {
    console.error("Failed to create recipe:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
