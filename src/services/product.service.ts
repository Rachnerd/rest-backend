import { PRODUCT_DATA } from "../data/product.data";
import { ProductUnion } from "../models/product.model";

export class ProductService {
  static get(): ProductUnion[] {
    return PRODUCT_DATA;
  }

  static getById(id: string): ProductUnion | undefined {
    return PRODUCT_DATA.find((product) => product.id === id);
  }
}
