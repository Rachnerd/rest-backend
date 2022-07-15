import fastify from "fastify";
import { CartController } from "./controllers/cart.controller";
import { PriceController } from "./controllers/price.controller";
import { ProductsController } from "./controllers/products.controller";

export const server = fastify();

server.addHook("onRequest", (request, reply, done) => {
  console.log(`Incoming request: ${request.url}`);
  done();
});

server.register(require("@fastify/cors"), {});

server.get("/products", ProductsController.get);
server.get("/products/:id", ProductsController.getById);

server.get("/cart", CartController.get);
server.post("/cart", CartController.post);
server.put("/cart", CartController.put);
server.delete("/cart/:id", CartController.delete);
server.get("/price/:id", PriceController.getById);
server.get("/price", PriceController.getByIds);

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
