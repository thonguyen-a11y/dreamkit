import { apiFetch } from "./api-client";
import type { CollarType, ColorKey, Product, ProductType } from "./types";

const UPLOADS_ORIGIN =
  process.env.NEXT_PUBLIC_UPLOADS_URL ?? "https://dreamkit.vn/wp-content";

const COLOR_KEYS = new Set<ColorKey>([
  "black",
  "white",
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "yellow",
  "gray",
  "cream",
]);

const COLLAR_TYPES = new Set<CollarType>(["regular", "polo"]);
const PRODUCT_TYPES = new Set<ProductType>(["set", "jersey", "polo-shirt"]);

/** Product shape returned by the NestJS products API. */
export interface ApiProduct {
  readonly _id: string;
  readonly slug: string;
  readonly name: string;
  readonly price: number;
  readonly category: string;
  readonly colors: readonly string[];
  readonly primaryColor: string;
  readonly image: string;
  readonly collar: string;
  readonly type: string;
  readonly isNew: boolean;
  readonly stock?: number;
  readonly createdAt?: string;
  readonly updatedAt?: string;
  readonly __v?: number;
}

export interface ProductsListMeta {
  readonly page: number;
  readonly limit: number;
  readonly total: number;
  readonly totalPages: number;
}

export interface ProductsListResponse {
  readonly data: readonly ApiProduct[];
  readonly meta: ProductsListMeta;
}

export interface FetchProductsSuccess {
  readonly ok: true;
  readonly products: readonly Product[];
}

export interface FetchProductsFailure {
  readonly ok: false;
  readonly message: string;
}

export type FetchProductsResult = FetchProductsSuccess | FetchProductsFailure;

function isColorKey(value: string): value is ColorKey {
  return COLOR_KEYS.has(value as ColorKey);
}

/** Resolves API-relative upload paths to absolute image URLs. */
export function resolveProductImage(image: string): string {
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }

  return `${UPLOADS_ORIGIN}${image}`;
}

/** Maps a backend product record to the frontend catalog model. */
export function mapApiProductToProduct(apiProduct: ApiProduct): Product | null {
  if (!isColorKey(apiProduct.primaryColor)) {
    return null;
  }

  const colors = apiProduct.colors.filter(isColorKey);
  if (colors.length === 0) {
    return null;
  }

  if (!COLLAR_TYPES.has(apiProduct.collar as CollarType)) {
    return null;
  }

  if (!PRODUCT_TYPES.has(apiProduct.type as ProductType)) {
    return null;
  }

  return {
    id: apiProduct._id,
    name: apiProduct.name,
    price: apiProduct.price,
    category: apiProduct.category,
    colors,
    primaryColor: apiProduct.primaryColor,
    image: resolveProductImage(apiProduct.image),
    collar: apiProduct.collar as CollarType,
    type: apiProduct.type as ProductType,
    isNew: apiProduct.isNew,
  };
}

/** Fetches the public product catalog from the API. */
export async function fetchProductsApi(): Promise<FetchProductsResult> {
  const result = await apiFetch<ProductsListResponse>("/api/products", {
    method: "GET",
  });

  if (!result.ok) {
    return {
      ok: false,
      message: result.message,
    };
  }

  const products = result.data.data
    .map(mapApiProductToProduct)
    .filter((product): product is Product => product !== null);

  return { ok: true, products };
}
