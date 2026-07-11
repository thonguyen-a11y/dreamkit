import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { OrderManager } from "@/components/admin/order-manager";

export const metadata: Metadata = {
  title: "Đơn hàng — Admin Dreamkit",
};

export default function AdminOrdersPage() {
  return (
    <AdminShell>
      <OrderManager />
    </AdminShell>
  );
}
