import fastify from "fastify";
import { CartController } from "./controllers/cart.controller";
import { ProductsController } from "./controllers/products.controller";

export const server = fastify();

server.register(require("@fastify/cors"), {});

server.get("/products", ProductsController.get);

server.get("/cart", CartController.get);
server.post("/cart", CartController.post);
server.put("/cart", CartController.put);
server.delete("/cart/:id", CartController.delete);

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
