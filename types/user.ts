import { Recipe } from "./recipe";

export interface User {
  id: string;
  name: string | null;
  email: string;
  image?: string | null;
  createdAt: Date;
}

export interface UserProfile extends User {
  recipesCount: number;
  favoritesCount: number;
  ratingsCount: number;
  commentsCount: number;
  averageRatingReceived: number;
}

export interface Favorite {
  id: string;
  userId: string;
  recipeId: string;
  createdAt: Date;
  recipe?: Recipe;
}