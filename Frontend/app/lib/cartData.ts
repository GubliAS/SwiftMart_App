// app/lib/cartData.ts

export type CartItem = {
  id: string;
  name: string;
  quantity: number;
};

export type Cart = {
  id: string;
  name: string;
  items: CartItem[];
};

export const initialCarts: Cart[] = [
  {
    id: "1",
    name: "My Cart",
    items: [],
  },
];

export default initialCarts;