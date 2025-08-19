import { NextRequest, NextResponse } from "next/server";
import { recipeService } from "@/services/recipe.service";
import { DEFAULT_LIMIT_PER_PAGE } from "@/lib/constants";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "recent";
    const query = searchParams.get("q");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(
      searchParams.get("limit") || "DEFAULT_LIMIT_PER_PAGE"
    );

    let result;

    if (query) {
      result = await recipeService.searchRecipes(query, { page, limit });
    } else if (type === "popular") {
      result = await recipeService.getPopularRecipes({ page, limit });
    } else {
      result = await recipeService.getRecentRecipes({ page, limit });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 }
    );
  }
}
