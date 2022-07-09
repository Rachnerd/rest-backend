import { Pagination, PaginationParams } from "../models/pagination.model";

export class PaginationParseException extends Error {}

export class PaginationService {
  static parseQueryParams({
    page: pageQuery,
    size: sizeQuery,
  }: Record<keyof PaginationParams, string>): PaginationParams {
    const size = parseInt(sizeQuery, 10);
    const page = parseInt(pageQuery, 10);
    if (isNaN(size)) {
      throw new PaginationParseException("Missing size query param");
    }
    if (size <= 0) {
      throw new PaginationParseException(
        "Size query param can't be 0 or lower"
      );
    }
    if (isNaN(page)) {
      throw new PaginationParseException("Missing page query param");
    }
    if (size <= 0) {
      throw new PaginationParseException(
        "Page query param can't be lower than 0"
      );
    }
    return { page, size };
  }

  static paginate<T>(
    { page, size }: PaginationParams,
    results: T[]
  ): Pagination<T> {
    const startIndex = (page - 1) * size;
    return {
      page,
      size,
      results: results.slice(startIndex, startIndex + size),
      totalResults: results.length,
      totalPages: Math.ceil(results.length / size),
    };
  }
}
