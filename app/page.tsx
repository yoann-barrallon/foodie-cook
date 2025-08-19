import { Suspense } from "react";
import { recipeService } from "@/services/recipe.service";
import { SearchBar } from "../components/recipes/search-bar";
import { RecipeGrid } from "../components/recipes/recipe-grid";
import { RecipeTabs } from "./_components/recipe-tabs";
import { GetRecipesParams } from "@/types";
import { auth } from "@/lib/auth";
import { Pagination } from "@/app/_components/pagination";
import { DEFAULT_LIMIT_PER_PAGE } from "@/lib/constants";

interface HomePageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

async function getRecipes(params: GetRecipesParams) {
  try {
    const {
      type = "recent",
      query,
      page = 1,
      limit = DEFAULT_LIMIT_PER_PAGE,
    } = params;

    if (query) {
      return await recipeService.searchRecipes(query, {
        page: Number(page),
        limit: Number(limit),
      });
    } else if (type === "popular") {
      return await recipeService.getPopularRecipes({
        page: Number(page),
        limit: Number(limit),
      });
    } else {
      return await recipeService.getRecentRecipes({
        page: Number(page),
        limit: Number(limit),
      });
    }
  } catch (error) {
    console.error("Error fetching recipes:", error);
    return {
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
  }
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const resolvedSearchParams = await searchParams;
  const params = {
    type: (resolvedSearchParams.type as "recent" | "popular") || "recent",
    query: resolvedSearchParams.q as string,
    page: Number(resolvedSearchParams.page) || 1,
    limit: DEFAULT_LIMIT_PER_PAGE,
  };

  const recipesData = await getRecipes(params);
  const isSearching = Boolean(params.query);
  const session = await auth();

  let title = "Recettes récentes";
  if (isSearching) {
    title = `Résultats pour "${params.query}"`;
  } else if (params.type === "popular") {
    title = "Recettes populaires";
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <section className="text-center space-y-6">
        <div className="space-y-3">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Foodie
          </h1>
          <p className="text-lg md:text-xl text-foreground-600 max-w-2xl mx-auto">
            Découvrez, partagez et cuisinez vos recettes préférées. Une
            communauté de passionnés de cuisine vous attend !
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Suspense
            fallback={
              <div className="h-14 bg-default-200 rounded-lg animate-pulse" />
            }
          >
            <SearchBar />
          </Suspense>
        </div>
      </section>

      <section className="space-y-6">
        {!isSearching && (
          <div className="flex justify-center">
            <Suspense
              fallback={
                <div className="h-10 w-48 bg-default-200 rounded-lg animate-pulse" />
              }
            >
              <RecipeTabs />
            </Suspense>
          </div>
        )}

        <RecipeGrid
          recipes={recipesData.data.map((recipe) => ({
            ...recipe,
            instructions: recipe.instructions || undefined,
          }))}
          title={title}
          emptyMessage={
            isSearching
              ? "Aucune recette ne correspond à votre recherche. Essayez avec d'autres mots-clés."
              : "Aucune recette disponible pour le moment."
          }
        />

        {recipesData.pagination.total > 0 && (
          <div className="text-center text-sm text-foreground-500">
            Affichage de {recipesData.data.length} recette(s) sur{" "}
            {recipesData.pagination.total} au total
          </div>
        )}
      </section>

      <div className="flex justify-center">
        <Pagination
          currentPage={recipesData.pagination.page}
          totalPages={recipesData.pagination.totalPages}
          searchPath="/"
        />
      </div>

      {!session?.user && (
        <section className="text-center space-y-4 py-12 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl">
          <h2 className="text-2xl md:text-3xl font-bold">
            Prêt à partager vos recettes ?
          </h2>
          <p className="text-foreground-600 max-w-lg mx-auto">
            Rejoignez notre communauté et partagez vos créations culinaires avec
            des milliers de passionnés.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/auth/signup"
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              Commencer maintenant
            </a>
          </div>
        </section>
      )}
    </div>
  );
}
