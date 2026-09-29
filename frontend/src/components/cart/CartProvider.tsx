"use client";


import CartDrawer from "./CartDrawer";

import { useCartStore } from "@/store/cart-store";


export default function CartProvider() {

  const isOpen =
    useCartStore(
      (state) => state.isOpen
    );


  const closeCart =
    useCartStore(
      (state) => state.closeCart
    );


  return (

    <CartDrawer
      open={isOpen}
      onClose={closeCart}
    />

  );
}