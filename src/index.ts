import fastify, { FastifyRequest } from "fastify";
import { PaginationParams } from "./models/pagination.model";
import {
  PaginationParseException,
  PaginationSerivce,
} from "./services/pagination.service";
import { ProductService } from "./services/product.service";

const server = fastify();

server.register(require("@fastify/cors"), {});

type ProductsRequest = FastifyRequest<{
  Querystring: Record<keyof PaginationParams, string>;
}>;

server.get("/products", async ({ query }: ProductsRequest, reply) => {
  try {
    const paginationParams = PaginationSerivce.parseQueryParams(query);
    return ProductService.get(paginationParams);
  } catch (error) {
    if (error instanceof PaginationParseException) {
      return reply.status(400).send(error);
    } else {
      return reply.status(500).send();
    }
  }
});

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
