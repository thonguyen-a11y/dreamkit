"use client";



import {

  useCallback,

  useEffect,

  useMemo,

  useState,

  type ReactNode,

} from "react";

import {

  createOrder,

  removeOrder,

  updateOrderStatus as updateOrderStatusInList,

  parseOrders,

  type CreateOrderInput,

} from "@/lib/orders";

import { fetchProductsApi } from "@/lib/products-api";

import { PRODUCTS } from "@/lib/products";

import type { Order, OrderStatus, Product } from "@/lib/types";

import { useToast } from "@/components/ui/toast-context";

import { StoreContext, type StoreContextValue } from "./store-context";



const ORDERS_STORAGE_KEY = "dreamkit-orders";



function readOrders(): readonly Order[] {

  if (typeof window === "undefined") {

    return [];

  }



  try {

    const stored = window.localStorage.getItem(ORDERS_STORAGE_KEY);

    if (!stored) {

      return [];

    }

    return parseOrders(JSON.parse(stored));

  } catch {

    return [];

  }

}



/**

 * Central client store for API-backed products and customer orders.

 * Products are loaded from the backend; orders persist to localStorage.

 */

export function StoreProvider({ children }: { children: ReactNode }) {

  const { showToast } = useToast();

  const [products, setProducts] = useState<readonly Product[]>([]);

  const [orders, setOrders] = useState<readonly Order[]>([]);

  const [isHydrated, setIsHydrated] = useState(false);

  const [productsError, setProductsError] = useState<string | null>(null);



  const refreshProducts = useCallback(async () => {

    const result = await fetchProductsApi();



    if (result.ok) {

      setProducts(result.products);

      setProductsError(null);

      return;

    }



    setProducts(PRODUCTS);

    setProductsError(result.message);

    showToast(result.message, "error");

  }, [showToast]);



  useEffect(() => {

    let cancelled = false;



    async function hydrate() {

      await refreshProducts();

      if (!cancelled) {

        setOrders(readOrders());

        setIsHydrated(true);

      }

    }



    void hydrate();



    return () => {

      cancelled = true;

    };

  }, [refreshProducts]);



  useEffect(() => {

    if (!isHydrated) {

      return;

    }

    try {

      window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));

    } catch {

      // Ignore storage failures.

    }

  }, [orders, isHydrated]);



  const createOrderAction = useCallback(

    (input: CreateOrderInput): Order | null => {

      const order = createOrder(input, products, orders);

      if (!order) {

        return null;

      }

      setOrders((current) => [order, ...current]);

      return order;

    },

    [products, orders],

  );



  const updateOrderStatusAction = useCallback((id: string, status: OrderStatus) => {

    setOrders((current) => updateOrderStatusInList(current, id, status));

  }, []);



  const deleteOrderAction = useCallback((id: string) => {

    setOrders((current) => removeOrder(current, id));

  }, []);



  const value = useMemo<StoreContextValue>(

    () => ({

      products,

      orders,

      isHydrated,

      productsError,

      refreshProducts,

      createOrder: createOrderAction,

      updateOrderStatus: updateOrderStatusAction,

      deleteOrder: deleteOrderAction,

    }),

    [

      products,

      orders,

      isHydrated,

      productsError,

      refreshProducts,

      createOrderAction,

      updateOrderStatusAction,

      deleteOrderAction,

    ],

  );



  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;

}

