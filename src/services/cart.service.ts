import { add, min, multiply, subtract } from "mathjs";
import { inMemoryCache } from "../data/cache";
import { PRODUCT_DATA } from "../data/product.data";
import { CartProduct } from "../models/cart.model";

export interface Cart {
  products: CartProduct[];
  total: number;
}

const CART_CACHE_KEY = "CART";

inMemoryCache.set(CART_CACHE_KEY, {
  products: [
    { id: "2", total: 89.2, price: 22.3, quantity: 4 },
    { id: "3", total: 55.99, price: 55.99, quantity: 1 },
  ],
  total: 145.19,
});

export class CartProductAlreadyExistsError extends Error {}
export class ProductUnknownError extends Error {}
export class CantUpdateCartProductError extends Error {}

export class CartService {
  static get(): Cart {
    return (
      inMemoryCache.get(CART_CACHE_KEY) ?? {
        products: [],
        total: 0,
      }
    );
  }

  static post({ id, quantity }: Pick<CartProduct, "id" | "quantity">) {
    const { products, total } = CartService.get();
    if (products.some((product) => product.id === id)) {
      throw new CartProductAlreadyExistsError();
    }
    const product = PRODUCT_DATA.find((product) => product.id === id);
    if (!product) {
      throw new ProductUnknownError();
    }
    const cartProductTotal = multiply(product.price, quantity);
    products.push({
      id,
      quantity,
      price: product.price,
      total: cartProductTotal,
    });

    inMemoryCache.set(CART_CACHE_KEY, {
      products,
      total: add(total, cartProductTotal),
    });
  }

  static update({ id, quantity }: Pick<CartProduct, "id" | "quantity">) {
    const { products, total } = CartService.get();
    const index = products.findIndex((product) => product.id === id);

    if (index === -1) {
      throw new CantUpdateCartProductError();
    }

    const newCartProductTotal = multiply(quantity, products[index].price);
    const newCartTotal = add(
      total,
      subtract(newCartProductTotal, products[index].total)
    );

    products[index].quantity = quantity;
    products[index].total = newCartProductTotal;

    inMemoryCache.set(CART_CACHE_KEY, {
      products,
      total: newCartTotal,
    });
  }

  static delete(id: string) {
    const { products, total } = CartService.get();

    const index = products.findIndex((product) => product.id === id);

    if (index === -1) {
      return;
    }
    const newTotal = total - products[index].total;
    products.splice(index, 1);

    inMemoryCache.set(CART_CACHE_KEY, {
      products,
      total: newTotal,
    });
  }
}
