import { writeFile } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

export async function saveUploadedFile(file: File): Promise<string> {
  if (!file) {
    throw new Error("Aucun fichier fourni");
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Type de fichier non supporté. Utilisez JPG, PNG ou WebP.");
  }

  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error("Le fichier est trop volumineux. Taille maximum: 5MB.");
  }

  const fileExtension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const fileName = `${randomUUID()}.${fileExtension}`;

  const uploadDir = join(process.cwd(), "public", "uploads", "recipes");
  const filePath = join(uploadDir, fileName);

  try {
    const bytes = await file.arrayBuffer();
    const buffer = new Uint8Array(bytes);

    await writeFile(filePath, buffer);

    return `/uploads/recipes/${fileName}`;
  } catch (error) {
    console.error("Erreur lors de la sauvegarde du fichier:", error);
    throw new Error("Erreur lors de la sauvegarde de l'image");
  }
}

export function deleteUploadedFile(imagePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const fs = require("fs");
    const fullPath = join(process.cwd(), "public", imagePath);

    fs.unlink(fullPath, (err: any) => {
      if (err && err.code !== "ENOENT") {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
