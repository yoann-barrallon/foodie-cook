"use client";

import { Pagination as HeroUIPagination } from "@heroui/pagination";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  searchPath: string;
}

export function Pagination({
  currentPage,
  totalPages,
  searchPath,
}: PaginationProps) {
  if (totalPages <= 1) return null;
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`${searchPath}?${params.toString()}`);
  };

  return (
    <HeroUIPagination
      page={currentPage}
      total={totalPages}
      onChange={handlePageChange}
      showControls
      color="primary"
      size="md"
    />
  );
}
