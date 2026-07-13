"use client";

import { createContext, useContext } from "react";
import type { CreateOrderInput } from "@/lib/orders";
import type { Order, OrderStatus, Product } from "@/lib/types";

export interface StoreContextValue {
  readonly products: readonly Product[];
  readonly orders: readonly Order[];
  readonly isHydrated: boolean;
  readonly productsError: string | null;
  readonly refreshProducts: () => Promise<void>;
  readonly createOrder: (input: CreateOrderInput) => Order | null;
  readonly updateOrderStatus: (id: string, status: OrderStatus) => void;
  readonly deleteOrder: (id: string) => void;
}

export const StoreContext = createContext<StoreContextValue | null>(null);

export function useStore(): StoreContextValue {
  const context = useContext(StoreContext);
  if (context === null) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
}
