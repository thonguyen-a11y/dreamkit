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

import {

  deleteProduct as deleteProductInList,

  upsertProduct as upsertProductInList,

  validateProduct,

} from "@/lib/product-admin";

import { fetchProductsApi } from "@/lib/products-api";

import { PRODUCTS } from "@/lib/products";

import type { Order, OrderStatus, Product } from "@/lib/types";

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

  }, []);



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



  const upsertProduct = useCallback(

    (product: Product, originalId?: string): boolean => {

      const errors = validateProduct(product, products, originalId);

      if (Object.keys(errors).length > 0) {

        return false;

      }

      setProducts((current) => upsertProductInList(current, product, originalId));

      return true;

    },

    [products],

  );



  const deleteProduct = useCallback((id: string) => {

    setProducts((current) => deleteProductInList(current, id));

  }, []);



  const resetProducts = useCallback(() => {

    void refreshProducts();

  }, [refreshProducts]);



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

      upsertProduct,

      deleteProduct,

      resetProducts,

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

      upsertProduct,

      deleteProduct,

      resetProducts,

      createOrderAction,

      updateOrderStatusAction,

      deleteOrderAction,

    ],

  );



  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;

}

