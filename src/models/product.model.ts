interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
  quantity: Quantity;
}

interface Rating {
  rate: number;
  count: number;
}

interface Quantity {
  min: number;
  step: number;
  max: number;
}

type ProductOutOfStock = Omit<Product, "quantity">;

interface ProductReplaced extends ProductOutOfStock {
  replacement: Product;
}

export type ProductUnion = Product | ProductReplaced | ProductOutOfStock;
