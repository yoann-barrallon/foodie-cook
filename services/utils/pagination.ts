import {
  PaginationOptions,
  PaginatedResponse,
  DEFAULT_PAGINATION,
} from "../types";

export function calculatePagination(options: PaginationOptions) {
  const page = Math.max(1, options.page || DEFAULT_PAGINATION.page);
  const limit = Math.min(
    100,
    Math.max(1, options.limit || DEFAULT_PAGINATION.limit)
  );
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}
