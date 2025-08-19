import { API_BASE_URL } from "../constants";

export const ratingApi = {
  async getRatingsByRecipeId(recipeId: string) {
    const response = await fetch(
      `${API_BASE_URL}/ratings?recipeId=${recipeId}`
    );
    return response.json();
  },
  async getRatingsByUserId(userId: string) {
    const response = await fetch(`${API_BASE_URL}/ratings?userId=${userId}`);
    return response.json();
  },
  async getRatingByRecipeIdAndUserId(recipeId: string, userId: string) {
    const response = await fetch(
      `${API_BASE_URL}/ratings?recipeId=${recipeId}&userId=${userId}`
    );
    return response.json();
  },
};
