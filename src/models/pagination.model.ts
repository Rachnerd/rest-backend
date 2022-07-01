export interface Pagination<T> {
  page: number;
  size: number;
  totalResults: number;
  totalPages: number;
  results: T[];
}

export type PaginationParams = Pick<Pagination<unknown>, "page" | "size">;
