import { FastifyReply, FastifyRequest } from "fastify";
import { CartProduct } from "../models/cart.model";
import { Pagination, PaginationParams } from "../models/pagination.model";
import {
  CantUpdateCartProductError,
  Cart,
  CartProductAlreadyExistsError,
  CartService,
  ProductUnknownError,
} from "../services/cart.service";
import {
  PaginationParseException,
  PaginationService,
} from "../services/pagination.service";

type CartGetRequest = FastifyRequest<{
  Querystring: Record<keyof PaginationParams, string>;
}>;

type CartPostRequest = FastifyRequest<{
  Body: Pick<CartProduct, "id" | "quantity">;
}>;

type CartPutRequest = FastifyRequest<{
  Body: Pick<CartProduct, "id" | "quantity">;
}>;

type CartDeleteRequest = FastifyRequest<{
  Params: { id: string };
}>;

interface PaginatedCart extends Omit<Cart, "products"> {
  products: Pagination<CartProduct>;
}
export class CartController {
  static async get(
    { query }: CartGetRequest,
    reply: FastifyReply
  ): Promise<PaginatedCart> {
    let paginationParams: PaginationParams;
    try {
      paginationParams = PaginationService.parseQueryParams(query);
    } catch (e) {
      if (e instanceof PaginationParseException) {
        paginationParams = {
          page: 1,
          size: 10000,
        };
      } else {
        return reply.status(500).send();
      }
    }
    const { products, total } = CartService.get();
    const paginatedCartProducts = PaginationService.paginate(
      paginationParams,
      products
    );
    return {
      products: paginatedCartProducts,
      total,
    };
  }

  static post(request: CartPostRequest, reply: FastifyReply) {
    if (request.body.id === undefined) {
      return reply.status(400).send("Missing id");
    }
    if (request.body.quantity === undefined) {
      return reply.status(400).send("Missing quantity");
    }
    try {
      CartService.post(request.body);
      return reply.status(204).send();
    } catch (error) {
      if (error instanceof CartProductAlreadyExistsError) {
        return reply.status(409).send();
      }
      if (error instanceof ProductUnknownError) {
        return reply.status(400).send("id doesn't exist");
      }

      return reply.status(500).send();
    }
  }

  static put(request: CartPutRequest, reply: FastifyReply) {
    if (request.body.id === undefined) {
      return reply.status(400).send("Can't update cart product without id");
    }
    try {
      CartService.update(request.body);
      return reply.status(204).send();
    } catch (error) {
      if (error instanceof CantUpdateCartProductError) {
        return reply
          .status(400)
          .send(`Cart product doesn't exist ${request.body.id}`);
      }
      return reply.status(500).send();
    }
  }

  static delete(request: CartDeleteRequest, reply: FastifyReply) {
    CartService.delete(request.params.id);
    return reply.status(204).send();
  }
}
