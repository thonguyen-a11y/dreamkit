import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { DiscountCodeManager } from "@/components/admin/discount-code-manager";

export const metadata: Metadata = {
  title: "Mã giảm giá — Admin Dreamkit",
};

export default function AdminDiscountCodesPage() {
  return (
    <AdminShell>
      <DiscountCodeManager />
    </AdminShell>
  );
}
