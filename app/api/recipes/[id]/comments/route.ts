import { NextRequest, NextResponse } from "next/server";
import { commentService } from "@/services";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");

  const comments = await commentService.getCommentsByRecipeId(id, {
    page,
    limit,
  });

  return NextResponse.json(comments);
}
