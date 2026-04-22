export type PaginationParams = {
  limit: number;
  cursor?: string | null;
};

export type PaginatedResult<T> = {
  items: T[];
  cursor: string | null;
};
