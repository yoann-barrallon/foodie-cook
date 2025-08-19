export interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  prepTime: number;
  category: string;
  instructions?: string | null;
  createdAt: Date;
  author?: {
    id: string;
    name: string | null;
    image?: string | null;
  };
  _count: {
    comments: number;
    favorites: number;
    ratings: number;
  };
  averageRating: number;
}

export interface RecipeIngredient {
  id: string;
  quantity?: number;
  unit?: string;
  ingredient: {
    id: string;
    name: string;
  };
}

export interface RecipeWithDetails extends Recipe {
  ingredients: RecipeIngredient[];
  ratings: Rating[];
  comments: Comment[];
}

export interface Rating {
  id: string;
  score: number;
  userId: string;
  user: {
    name: string | null;
    image?: string | null;
  };
  createdAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  recipeId: string;
  user: {
    name: string | null;
    image?: string | null;
  };
  createdAt: Date;
  updatedAt: Date | null;
}

export interface Ingredient {
  id: string;
  name: string;
}

export interface CreateRecipeData {
  title: string;
  description: string;
  imageUrl: string;
  prepTime: number;
  category: string;
  instructions?: string;
  ingredients: {
    ingredientId: string;
    quantity?: number;
    unit?: string;
  }[];
}

export interface UpdateRecipeData extends Partial<CreateRecipeData> {
  id: string;
}
