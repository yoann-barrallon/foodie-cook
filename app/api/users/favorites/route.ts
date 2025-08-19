import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { userService } from "@/services/user.service";
import { favoriteService } from "@/services/favorite.service";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const user = await userService.getUserByEmail(session.user.email);

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const favorites = await favoriteService.getFavoriteRecipesWithDetails(
      user.id,
      {
        page,
        limit,
        sortBy: "createdAt",
        sortOrder: "desc",
      }
    );

    const response = {
      data: favorites.data,
      pagination: {
        ...favorites.pagination,
        hasNext: favorites.pagination.page < favorites.pagination.totalPages,
        hasPrev: favorites.pagination.page > 1,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Erreur lors de la récupération des favoris:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
