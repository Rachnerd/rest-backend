import { FastifyReply, FastifyRequest } from "fastify";
import { Pagination, PaginationParams } from "../models/pagination.model";
import { ProductUnion } from "../models/product.model";
import {
  PaginationParseException,
  PaginationService,
} from "../services/pagination.service";
import { ProductService } from "../services/product.service";

type ProductsRequest = FastifyRequest<{
  Querystring: Record<keyof PaginationParams, string>;
}>;

export class ProductsController {
  static async get(
    { query }: ProductsRequest,
    reply: FastifyReply
  ): Promise<Pagination<ProductUnion>> {
    try {
      const paginationParams = PaginationService.parseQueryParams(query);
      return ProductService.get(paginationParams);
    } catch (error) {
      if (error instanceof PaginationParseException) {
        return reply.status(400).send(error);
      } else {
        return reply.status(500).send();
      }
    }
  }
}
