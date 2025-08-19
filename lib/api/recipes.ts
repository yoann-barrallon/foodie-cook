import type {
  Recipe,
  ApiResponse,
  GetRecipesParams,
  Comment,
  PaginationParams,
} from "@/types";
import { DEFAULT_LIMIT_PER_PAGE, API_BASE_URL } from "@/lib/constants";

async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
  }
  return response.json();
}

export const recipesApi = {
  async getRecipes(
    params: GetRecipesParams = {}
  ): Promise<ApiResponse<Recipe>> {
    const searchParams = new URLSearchParams();

    if (params.query) {
      searchParams.set("q", params.query);
    } else if (params.type) {
      searchParams.set("type", params.type);
    }

    if (params.page) {
      searchParams.set("page", params.page.toString());
    }

    if (params.limit) {
      searchParams.set("limit", params.limit.toString());
    }

    const response = await fetch(
      `${API_BASE_URL}/recipes?${searchParams.toString()}`
    );
    return handleApiResponse<ApiResponse<Recipe>>(response);
  },

  /**
   * Get recent recipes
   */
  async getRecentRecipes(
    limit = DEFAULT_LIMIT_PER_PAGE
  ): Promise<ApiResponse<Recipe>> {
    return this.getRecipes({ type: "recent", limit });
  },

  /**
   * Get popular recipes
   */
  async getPopularRecipes(
    limit = DEFAULT_LIMIT_PER_PAGE
  ): Promise<ApiResponse<Recipe>> {
    return this.getRecipes({ type: "popular", limit });
  },

  /**
   * Search recipes
   */
  async searchRecipes(
    query: string,
    limit = DEFAULT_LIMIT_PER_PAGE
  ): Promise<ApiResponse<Recipe>> {
    return this.getRecipes({ query, limit });
  },

  /**
   * Get a recipe by id
   */
  async getRecipeById(id: string): Promise<Recipe> {
    const response = await fetch(`${API_BASE_URL}/recipes/${id}`);
    return handleApiResponse<Recipe>(response);
  },

  /**
   * Get comments by recipe id
   */
  async getCommentsByRecipeId(
    id: string,
    params: PaginationParams
  ): Promise<ApiResponse<Comment>> {
    const searchParams = new URLSearchParams();

    if (params.page) {
      searchParams.set("page", params.page.toString());
    }

    const response = await fetch(
      `${API_BASE_URL}/recipes/${id}/comments?${searchParams.toString()}`
    );
    return handleApiResponse<ApiResponse<Comment>>(response);
  },
};
