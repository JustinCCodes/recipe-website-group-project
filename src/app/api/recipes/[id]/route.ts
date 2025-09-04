import { PrismaClient } from "@/generated/prisma";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

interface Params {
  params: {
    id: string;
  };
}

/**
 * @swagger
 * /api/recipes/{id}:
 * get:
 * description: Returns a single recipe by ID
 * parameters:
 * - name: id
 * in: path
 * required: true
 * schema:
 * type: string
 * responses:
 * 200:
 * description: A single recipe
 * 404:
 * description: Recipe not found
 */
export async function GET(request: Request, { params }: Params) {
  try {
    const recipeId = parseInt(params.id, 10);
    if (isNaN(recipeId)) {
      return new NextResponse("Invalid ID format", { status: 400 });
    }

    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
    });

    if (!recipe) {
      return new NextResponse("Recipe not found", { status: 404 });
    }

    return NextResponse.json(recipe);
  } catch (error) {
    console.error(`Failed to fetch recipe ${params.id}:`, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

/**
 * @swagger
 * /api/recipes/{id}:
 * patch:
 * description: Updates a recipe
 * parameters:
 * - name: id
 * in: path
 * required: true
 * responses:
 * 200:
 * description: Recipe updated
 */
export async function PATCH(request: Request, { params }: Params) {
  try {
    const recipeId = parseInt(params.id, 10);
    if (isNaN(recipeId)) {
      return new NextResponse("Invalid ID format", { status: 400 });
    }

    const body = await request.json();

    const updatedRecipe = await prisma.recipe.update({
      where: { id: recipeId },
      data: body,
    });

    return NextResponse.json(updatedRecipe);
  } catch (error) {
    console.error(`Failed to update recipe ${params.id}:`, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

/**
 * @swagger
 * /api/recipes/{id}:
 * delete:
 * description: Deletes a recipe
 * parameters:
 * - name: id
 * in: path
 * required: true
 * responses:
 * 200:
 * description: Recipe deleted
 */
export async function DELETE(request: Request, { params }: Params) {
  try {
    const recipeId = parseInt(params.id, 10);
    if (isNaN(recipeId)) {
      return new NextResponse("Invalid ID format", { status: 400 });
    }

    await prisma.recipe.delete({
      where: { id: recipeId },
    });

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error(`Failed to delete recipe ${params.id}:`, error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
