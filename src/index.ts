import fastify, { FastifyRequest } from "fastify";
import { PaginationParams } from "./models/pagination.model";
import { ProductService } from "./services/product.service";

const server = fastify();

server.register(require("@fastify/cors"), {});

type ProductsRequest = FastifyRequest<{
  Querystring: Record<keyof PaginationParams, string>;
}>;

server.get(
  "/products",
  async (
    { query: { size: sizeQuery, page: pageQuery } }: ProductsRequest,
    reply
  ) => {
    const size = parseInt(sizeQuery, 10);
    const page = parseInt(pageQuery, 10);
    if (isNaN(size) || size <= 0 || isNaN(page) || page < 0) {
      return reply.status(400).send();
    }
    return ProductService.get({ size, page });
  }
);

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
