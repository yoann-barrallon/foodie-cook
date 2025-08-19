"use client";

import { ApiResponse, Comment } from "@/types";
import { useState, useTransition, ChangeEvent } from "react";
import { Card, CardBody } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Textarea } from "@heroui/input";
import { Divider } from "@heroui/divider";
import { Chip } from "@heroui/chip";
import { useSession } from "next-auth/react";
import { addComment } from "@/app/actions/recipes/add-comment.action";
import { FaComment, FaClock, FaEdit, FaTrash, FaRegEdit } from "react-icons/fa";
import { addToast } from "@heroui/toast";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { Pagination } from "@heroui/pagination";
import { recipesApi } from "@/lib/api/recipes";
import { deleteComment } from "@/app/actions/recipes/delete-comment.action";
import { editComment } from "@/app/actions/recipes/edit-comment.action";

interface CommentSectionProps {
  recipeId: string;
  initialCommentCount: number;
  initialComments: ApiResponse<Comment>;
}

export default function CommentSection({
  recipeId,
  initialCommentCount,
  initialComments,
}: CommentSectionProps) {
  const [comments, setComments] = useState(initialComments.data);
  const [pagination, setPagination] = useState(initialComments.pagination);
  const [commentCount, setCommentCount] = useState(initialCommentCount);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, startTransition] = useTransition();
  const [isLoadingPage, setIsLoadingPage] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string>("");
  const [editingContent, setEditingContent] = useState<string>("");
  const [isEditingSubmitting, setIsEditingSubmitting] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: session } = useSession();

  const loadCommentsPage = async (page: number) => {
    setIsLoadingPage(true);
    try {
      const response = await recipesApi.getCommentsByRecipeId(recipeId, {
        page,
      });
      setComments(response.data);
      setPagination(response.pagination);
      setCommentCount(response.pagination.total);
    } catch (error) {
      console.error("Error loading comments page:", error);
      addToast({
        title: "Erreur lors du chargement des commentaires",
        color: "danger",
      });
    } finally {
      setIsLoadingPage(false);
    }
  };

  const handlePageChange = (page: number) => {
    loadCommentsPage(page);
  };

  const handleAddComment = async (formData: FormData) => {
    if (!session?.user) {
      addToast({
        title: "Vous devez être connecté pour commenter",
        color: "danger",
      });
      return;
    }

    if (!newComment.trim()) {
      addToast({
        title: "Le commentaire ne peut pas être vide",
        color: "danger",
      });
      return;
    }

    startTransition(async () => {
      try {
        const result = await addComment(formData);

        if (result.success && result.comment) {
          setNewComment("");
          addToast({
            title: "Commentaire ajouté avec succès !",
            color: "success",
          });

          setComments(result.comments.data);
          setPagination(result.comments.pagination);
          setCommentCount(result.comments.pagination.total);
        } else {
          addToast({
            title: result.error || "Erreur lors de l'ajout du commentaire",
            color: "danger",
          });
        }
      } catch (error) {
        addToast({
          title: "Erreur lors de l'ajout du commentaire",
          color: "danger",
        });
        console.error("Error adding comment:", error);
      }
    });
  };

  const handleDeleteComment = async (id: string) => {
    setIsDeleting(true);
    const result = await deleteComment(id);

    if (result.success) {
      await loadCommentsPage(pagination.page);
      addToast({
        title: "Commentaire supprimé avec succès !",
        color: "success",
      });
    } else {
      addToast({
        title: result.error || "Erreur lors de la suppression du commentaire",
        color: "danger",
      });
    }
    setIsDeleting(false);
    onClose();
  };

  const openDeleteModal = (commentId: string) => {
    setCommentToDelete(commentId);
    onOpen();
  };

  const startEditComment = (id: string, currentContent: string) => {
    setEditingCommentId(id);
    setEditingContent(currentContent);
  };

  const cancelEditComment = () => {
    setEditingCommentId("");
    setEditingContent("");
  };

  const handleEditComment = async (formData: FormData) => {
    setIsEditingSubmitting(true);
    try {
      const result = await editComment(formData);

      if (result.success) {
        setEditingCommentId("");
        setEditingContent("");
        await loadCommentsPage(pagination.page);
        addToast({
          title: "Commentaire modifié avec succès !",
          color: "success",
        });
      } else {
        addToast({
          title:
            result.error || "Erreur lors de la modification du commentaire",
          color: "danger",
        });
      }
    } catch (error) {
      addToast({
        title: "Erreur lors de la modification du commentaire",
        color: "danger",
      });
      console.error("Error editing comment:", error);
    } finally {
      setIsEditingSubmitting(false);
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diffInHours =
      (now.getTime() - commentDate.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return `Il y a ${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""}`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `Il y a ${hours} heure${hours !== 1 ? "s" : ""}`;
    } else if (diffInHours < 168) {
      const days = Math.floor(diffInHours / 24);
      return `Il y a ${days} jour${days !== 1 ? "s" : ""}`;
    } else {
      return commentDate.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FaComment className="text-primary text-xl" />
        <h2 className="text-xl font-semibold text-gray-800">Commentaires</h2>
        <Chip color="primary" variant="flat" size="sm">
          {commentCount}
        </Chip>
      </div>

      {session?.user ? (
        <Card shadow="sm">
          <CardBody>
            <form action={handleAddComment} className="space-y-4">
              <div className="flex items-start gap-3">
                <Avatar
                  src={session.user.image || undefined}
                  name={session.user.name || "Utilisateur"}
                  size="sm"
                />
                <div className="flex-1">
                  <Textarea
                    name="content"
                    placeholder="Ajoutez votre commentaire..."
                    value={newComment}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setNewComment(e.target.value)
                    }
                    minRows={3}
                    maxRows={6}
                    className="w-full"
                    isDisabled={isSubmitting}
                  />
                  <input type="hidden" name="recipeId" value={recipeId} />
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  color="primary"
                  isLoading={isSubmitting}
                  isDisabled={!newComment.trim()}
                  size="sm"
                >
                  Publier
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      ) : (
        <Card shadow="sm">
          <CardBody className="text-center py-6">
            <p className="text-gray-600 mb-4">
              Connectez-vous pour laisser un commentaire
            </p>
            <Button color="primary" variant="flat" size="sm">
              Se connecter
            </Button>
          </CardBody>
        </Card>
      )}

      <Divider />

      <div className="space-y-4">
        {isLoadingPage ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Chargement des commentaires...</p>
          </div>
        ) : comments.length > 0 ? (
          <>
            {comments.map((comment: Comment) => (
              <Card key={comment.id} shadow="sm">
                <CardBody>
                  <div className="flex items-start gap-3">
                    <Avatar
                      src={comment.user.image || undefined}
                      name={comment.user.name || "Anonyme"}
                      size="sm"
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-800">
                            {comment.user.name || "Anonyme"}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <FaClock className="text-xs" />
                            {formatDate(comment.createdAt)}
                          </span>
                          {comment.updatedAt &&
                            comment.updatedAt > comment.createdAt && (
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <FaRegEdit className="text-xs" />
                                {formatDate(comment.updatedAt)} (modifié)
                              </span>
                            )}
                        </div>
                        {session?.user?.id === comment.userId && (
                          <div className="flex items-center gap-1">
                            {editingCommentId === comment.id ? (
                              <Button
                                size="sm"
                                variant="light"
                                color="default"
                                onPress={cancelEditComment}
                                isDisabled={isEditingSubmitting}
                              >
                                Annuler
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="light"
                                isIconOnly
                                color="default"
                                onPress={() =>
                                  startEditComment(comment.id, comment.content)
                                }
                              >
                                <FaEdit className="text-xs" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="light"
                              isIconOnly
                              color="danger"
                              onPress={() => openDeleteModal(comment.id)}
                              isDisabled={editingCommentId === comment.id}
                            >
                              <FaTrash className="text-xs" />
                            </Button>
                          </div>
                        )}
                      </div>
                      {editingCommentId === comment.id ? (
                        <form action={handleEditComment} className="space-y-3">
                          <input
                            type="hidden"
                            name="commentId"
                            value={comment.id}
                          />
                          <Textarea
                            name="content"
                            value={editingContent}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                              setEditingContent(e.target.value)
                            }
                            minRows={3}
                            maxRows={6}
                            className="w-full"
                            isDisabled={isEditingSubmitting}
                          />
                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              color="default"
                              variant="light"
                              size="sm"
                              onPress={cancelEditComment}
                              isDisabled={isEditingSubmitting}
                            >
                              Annuler
                            </Button>
                            <Button
                              type="submit"
                              color="primary"
                              size="sm"
                              isLoading={isEditingSubmitting}
                              isDisabled={!editingContent.trim()}
                            >
                              Modifier
                            </Button>
                          </div>
                        </form>
                      ) : (
                        <p className="text-gray-700 leading-relaxed">
                          {comment.content}
                        </p>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}

            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-6">
                <Pagination
                  total={pagination.totalPages}
                  page={pagination.page}
                  onChange={handlePageChange}
                  color="primary"
                  size="sm"
                  showControls
                />
              </div>
            )}

            {pagination.total > 0 && (
              <div className="text-center text-sm text-foreground-500">
                Affichage de {comments.length} commentaire(s) sur{" "}
                {pagination.total} au total
              </div>
            )}
          </>
        ) : (
          <Card shadow="sm">
            <CardBody className="text-center py-8">
              <FaComment className="text-4xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">
                Aucun commentaire pour le moment
              </p>
              <p className="text-gray-400">
                Soyez le premier à partager votre avis !
              </p>
            </CardBody>
          </Card>
        )}
      </div>

      <Modal isOpen={isOpen} onOpenChange={onClose} size="sm">
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Supprimer le commentaire
              </ModalHeader>
              <ModalBody>
                <p>
                  Êtes-vous sûr de vouloir supprimer ce commentaire ? Cette
                  action est irréversible.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  variant="light"
                  onPress={onClose}
                  isDisabled={isDeleting}
                >
                  Annuler
                </Button>
                <Button
                  color="danger"
                  onPress={() => handleDeleteComment(commentToDelete)}
                  isLoading={isDeleting}
                >
                  Supprimer
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
