import { PrismaClient } from "../../../generated/prisma";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/recipes/search:
 * get:
 * description: Searches for recipes by name, description, or ingredients
 * parameters:
 * - name: q
 * in: query
 * required: true
 * schema:
 * type: string
 * responses:
 * 200:
 * description: A list of matching recipes
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return new NextResponse('Query parameter "q" is required', {
        status: 400,
      });
    }

    const recipes = await prisma.recipe.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            description: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            ingredients: {
              has: query,
            },
          },
        ],
      },
    });

    return NextResponse.json(recipes);
  } catch (error) {
    console.error("Search failed:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
