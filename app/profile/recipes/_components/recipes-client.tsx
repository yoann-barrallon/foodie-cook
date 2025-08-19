"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RecipeGrid } from "@/components/recipes/recipe-grid";
import { RecipesHeader } from "./recipes-header";
import { EmptyRecipes } from "./empty-recipes";
import { ErrorState } from "./error-state";
import { usersApi } from "@/lib/api/users";
import { Recipe, ApiResponse } from "@/types";
import { DEFAULT_LIMIT_PER_PAGE } from "@/lib/constants";
import { Pagination } from "@heroui/pagination";

interface RecipesClientProps {
  initialData: ApiResponse<Recipe>;
}

interface ClientState {
  recipes: Recipe[];
  pagination: ApiResponse<Recipe>["pagination"];
  loading: boolean;
  error: string | null;
  sortOrder: "desc" | "asc";
}

export function RecipesClient({ initialData }: RecipesClientProps) {
  const router = useRouter();
  const [state, setState] = useState<ClientState>({
    recipes: initialData.data.map((recipe) => ({
      ...recipe,
      instructions: recipe.instructions || undefined,
    })),
    pagination: initialData.pagination,
    loading: false,
    error: null,
    sortOrder: "desc",
  });

  const loadRecipes = async (page: number, sortOrder: "desc" | "asc") => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const data = await usersApi.getUserRecipes({
        page,
        limit: DEFAULT_LIMIT_PER_PAGE,
        sortBy: "createdAt",
        sortOrder,
      });

      setState((prev) => ({
        ...prev,
        recipes: data.data.map((recipe) => ({
          ...recipe,
          instructions: recipe.instructions || undefined,
        })),
        pagination: data.pagination,
        sortOrder,
        loading: false,
      }));

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Error fetching recipes:", error);
      setState((prev) => ({
        ...prev,
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "Impossible de charger vos recettes. Veuillez réessayer.",
      }));
    }
  };

  const handlePageChange = (page: number) => {
    loadRecipes(page, state.sortOrder);
  };

  const handleSortChange = () => {
    const newSortOrder = state.sortOrder === "desc" ? "asc" : "desc";
    loadRecipes(state.pagination.page, newSortOrder);
  };

  const handleRetry = () => {
    loadRecipes(1, state.sortOrder);
  };

  return (
    <>
      <RecipesHeader
        totalRecipes={state.pagination.total}
        currentPage={state.pagination.page}
        totalPages={state.pagination.totalPages}
        sortOrder={state.sortOrder}
        onBack={() => router.back()}
        onSortChange={handleSortChange}
      />

      {state.error ? (
        <ErrorState message={state.error} onRetry={handleRetry} />
      ) : state.recipes.length === 0 && !state.loading ? (
        <EmptyRecipes />
      ) : (
        <>
          <RecipeGrid
            recipes={state.recipes}
            loading={state.loading}
            emptyMessage="Aucune recette trouvée."
            showEditButton={true}
          />

          {state.pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                page={state.pagination.page}
                total={state.pagination.totalPages}
                onChange={handlePageChange}
                showControls
                color="primary"
                size="md"
              />
            </div>
          )}

          {state.pagination.total > 0 && (
            <div className="text-center text-sm text-foreground-500 mt-6">
              Affichage de {state.recipes.length} recette
              {state.recipes.length !== 1 ? "s" : ""} sur{" "}
              {state.pagination.total} au total
            </div>
          )}
        </>
      )}
    </>
  );
}
