import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { ProductManager } from "@/components/admin/product-manager";

export const metadata: Metadata = {
  title: "Sản phẩm — Admin Dreamkit",
};

export default function AdminProductsPage() {
  return (
    <AdminShell>
      <ProductManager />
    </AdminShell>
  );
}
