import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/admin-shell";
import { ContactManager } from "@/components/admin/contact-manager";

export const metadata: Metadata = {
  title: "Liên hệ — Admin Dreamkit",
};

export default function AdminContactsPage() {
  return (
    <AdminShell>
      <ContactManager />
    </AdminShell>
  );
}
