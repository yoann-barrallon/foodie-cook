export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
} as const;

export interface PublicUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  createdAt: Date;
} 