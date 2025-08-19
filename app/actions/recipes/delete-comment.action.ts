"use server";

import { auth } from "@/lib/auth";
import { commentService } from "@/services";
import z from "zod";

export async function deleteComment(id: string) {
  const session = await auth();
  const user = session?.user;

  const validatedData = z.object({
    commentId: z.string(),
  });
  const { commentId } = validatedData.parse({ commentId: id });

  if (!user) {
    return { error: "Unauthorized" };
  }

  const comment = await commentService.getCommentById(commentId);

  if (!comment) {
    return { error: "Comment not found", success: false };
  }

  if (comment.userId !== user.id) {
    return { error: "Unauthorized", success: false };
  }

  await commentService.deleteComment(commentId);

  return { success: true };
}
