import { FastifyReply, FastifyRequest } from "fastify";
import { PRODUCT_DATA, PRODUCT_DATA_NORMALIZED } from "../data/product.data";

type PriceGetByIdRequest = FastifyRequest<{
  Params: { id: string };
}>;

type PriceGetByIdsRequest = FastifyRequest<{
  Querystring: { ids: string };
}>;

export class PriceController {
  static async getById(
    { params: { id } }: PriceGetByIdRequest,
    reply: FastifyReply
  ): Promise<number | undefined> {
    const price = PRODUCT_DATA_NORMALIZED.byId[id]?.price;
    if (price === undefined) {
      return reply.status(404).send();
    }
    return reply.status(200).send(price);
  }

  static async getByIds(
    { query: { ids } }: PriceGetByIdsRequest,
    reply: FastifyReply
  ): Promise<(number | undefined)[]> {
    if (ids === undefined) {
      return reply.status(400).send("Missing ids query param");
    }
    const prices = ids
      .split(",")
      .map((id) => PRODUCT_DATA_NORMALIZED.byId[id]?.price);
    return reply.status(200).send(prices);
  }
}
