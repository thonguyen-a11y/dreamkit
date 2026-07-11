import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { UserManager } from "@/components/admin/user-manager";

export const metadata: Metadata = {
  title: "Khách hàng — Admin Dreamkit",
};

export default function AdminUsersPage() {
  return (
    <AdminShell>
      <UserManager />
    </AdminShell>
  );
}
