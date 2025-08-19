"use server";

import { auth } from "@/lib/auth";
import { commentService } from "@/services";
import z from "zod";

export async function editComment(formData: FormData) {
  const session = await auth();
  const user = session?.user;
  if (!user) {
    return { error: "Unauthorized" };
  }

  const validatedData = z.object({
    commentId: z.string(),
    content: z.string(),
  });
  const { commentId, content } = validatedData.parse({
    commentId: formData.get("commentId"),
    content: formData.get("content"),
  });

  const comment = await commentService.getCommentById(commentId);

  if (!comment) {
    return { error: "Comment not found", success: false };
  }

  if (comment.userId !== user.id) {
    return { error: "Unauthorized", success: false };
  }

  const updatedComment = await commentService.updateComment(commentId, {
    content,
  });

  return { success: true, comment: updatedComment };
}
