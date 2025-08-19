"use client";

import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { FaSearch } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback, useMemo } from "react";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  placeholder = "Rechercher une recette, un ingrédient...",
  className = "",
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const handleClear = useCallback(() => {
    setQuery("");
    router.push("/");
  }, [router]);

  const currentSearchParams = useMemo(() => {
    return new URLSearchParams(searchParams);
  }, [searchParams]);

  const handleSearch = useCallback(
    (searchQuery: string) => {
      const params = new URLSearchParams(currentSearchParams);

      if (searchQuery.trim()) {
        params.set("q", searchQuery.trim());
        params.delete("type");
      } else {
        params.delete("q");
      }

      params.delete("page");

      const queryString = params.toString();
      const url = queryString ? `/?${queryString}` : "/";

      router.push(url);
    },
    [router, currentSearchParams]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className={`w-full ${className}`}>
      <div className="flex gap-2">
        <Input
          className="flex-1"
          placeholder={placeholder}
          size="lg"
          startContent={<FaSearch className="text-foreground-400" />}
          value={query}
          variant="bordered"
          onClear={handleClear}
          onValueChange={setQuery}
        />
        <Button color="primary" size="lg" type="submit" variant="solid">
          Rechercher
        </Button>
      </div>
    </form>
  );
}
