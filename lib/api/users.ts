import type {
  Recipe,
  ApiResponse,
  UserProfile,
  Favorite,
  PaginationParams,
} from "@/types";

const API_BASE_URL = "/api";

async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
  }
  return response.json();
}

export const usersApi = {
  /**
   * Get user recipes
   */
  async getUserRecipes(
    params: PaginationParams = {}
  ): Promise<ApiResponse<Recipe>> {
    const searchParams = new URLSearchParams();

    if (params.page) {
      searchParams.set("page", params.page.toString());
    }

    if (params.limit) {
      searchParams.set("limit", params.limit.toString());
    }

    if (params.sortBy) {
      searchParams.set("sortBy", params.sortBy);
    }

    if (params.sortOrder) {
      searchParams.set("sortOrder", params.sortOrder);
    }

    const response = await fetch(
      `${API_BASE_URL}/users/recipes?${searchParams.toString()}`
    );
    return handleApiResponse<ApiResponse<Recipe>>(response);
  },

  /**
   * Get user favorites
   */
  async getUserFavorites(
    params: PaginationParams = {}
  ): Promise<ApiResponse<Favorite>> {
    const searchParams = new URLSearchParams();

    if (params.page) {
      searchParams.set("page", params.page.toString());
    }

    if (params.limit) {
      searchParams.set("limit", params.limit.toString());
    }

    if (params.sortBy) {
      searchParams.set("sortBy", params.sortBy);
    }

    if (params.sortOrder) {
      searchParams.set("sortOrder", params.sortOrder);
    }

    const response = await fetch(
      `${API_BASE_URL}/users/favorites?${searchParams.toString()}`
    );
    return handleApiResponse<ApiResponse<Favorite>>(response);
  },
};
