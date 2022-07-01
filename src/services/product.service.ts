import { PRODUCT_DATA } from "../data/product.data";
import { Pagination, PaginationParams } from "../models/pagination.model";
import { Product } from "../models/product.model";

export class ProductService {
  static get({ page, size }: PaginationParams): Pagination<Product> {
    const startIndex = (page - 1) * size;
    return {
      page,
      size,
      results: PRODUCT_DATA.slice(startIndex, startIndex + size),
      totalResults: PRODUCT_DATA.length,
      totalPages: Math.ceil(PRODUCT_DATA.length / size),
    };
  }
}
