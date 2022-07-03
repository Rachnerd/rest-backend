import fastify from "fastify";
import { ProductsController } from "./controllers/products.controller";

export const server = fastify();

server.register(require("@fastify/cors"), {});

server.get("/products", ProductsController.get);

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
