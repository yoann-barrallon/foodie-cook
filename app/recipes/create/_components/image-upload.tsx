"use client";
import { useState, useRef } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Image } from "@heroui/image";
import { Input } from "@heroui/input";
export default function ImageUpload() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Image de la recette *
      </label>

      <Input
        ref={fileInputRef}
        type="file"
        name="image"
        accept="image/*"
        required
        onChange={handleImageChange}
        className="hidden"
      />

      <Card className="border-2 border-dashed border-gray-300 hover:border-primary-400 transition-colors">
        <CardBody className="text-center py-8">
          {imagePreview ? (
            <div className="space-y-4">
              <Image
                src={imagePreview}
                alt="Aperçu de l'image"
                className="mx-auto w-32 h-32 object-cover rounded-lg border border-gray-200"
                radius="lg"
              />
              <Button
                onPress={handleButtonClick}
                color="primary"
                variant="bordered"
                size="sm"
              >
                Changer l'image
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <div>
                <Button
                  onPress={handleButtonClick}
                  color="primary"
                  variant="bordered"
                >
                  Choisir une image
                </Button>
                <p className="mt-2 text-sm text-gray-500">
                  Formats acceptés: JPG, PNG, WebP. Taille max: 5MB.
                </p>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
