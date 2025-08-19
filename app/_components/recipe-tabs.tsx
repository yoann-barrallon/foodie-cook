"use client";

import { Button } from "@heroui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface RecipeTabsProps {
  className?: string;
}

export function RecipeTabs({ className = "" }: RecipeTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentType = searchParams.get("type") || "recent";

  const handleTabChange = useCallback(
    (type: string) => {
      const params = new URLSearchParams(searchParams);

      if (type === "recent") {
        params.delete("type");
      } else {
        params.set("type", type);
      }

      params.delete("q");
      params.delete("page");

      const queryString = params.toString();
      const url = queryString ? `/?${queryString}` : "/";

      router.push(url);
    },
    [router, searchParams]
  );

  const tabs = [
    { key: "recent", label: "Récentes", icon: "🕒" },
    { key: "popular", label: "Populaires", icon: "⭐" },
  ];

  return (
    <div className={`flex gap-2 ${className}`}>
      {tabs.map((tab) => (
        <Button
          key={tab.key}
          color={currentType === tab.key ? "primary" : "default"}
          variant={currentType === tab.key ? "solid" : "bordered"}
          startContent={<span>{tab.icon}</span>}
          onPress={() => handleTabChange(tab.key)}
          className="flex-1 sm:flex-none"
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
}
