import { auth } from "@/lib/auth";
import { userService } from "@/services/user.service";
import { recipeService } from "@/services/recipe.service";
import { redirect } from "next/navigation";
import { RecipesClient } from "./_components/recipes-client";
import { DEFAULT_LIMIT_PER_PAGE } from "@/lib/constants";

export default async function ProfileRecipesPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/auth/signin");
  }

  const user = await userService.getUserByEmail(session.user.email);

  if (!user) {
    redirect("/auth/signin");
  }

  try {
    const initialRecipes = await recipeService.getRecipesByUserId(user.id, {
      page: 1,
      limit: DEFAULT_LIMIT_PER_PAGE,
      sortBy: "createdAt",
      sortOrder: "desc",
    });

    const initialData = {
      data: initialRecipes.data.map((recipe) => ({
        ...recipe,
        author: undefined,
        instructions: recipe.instructions || undefined,
      })),
      pagination: initialRecipes.pagination,
    };

    return (
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <RecipesClient initialData={initialData} />
      </div>
    );
  } catch (error) {
    console.error("Error loading initial recipes:", error);

    const emptyData = {
      data: [],
      pagination: {
        page: 1,
        limit: DEFAULT_LIMIT_PER_PAGE,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
    };

    return (
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <RecipesClient initialData={emptyData} />
      </div>
    );
  }
}
