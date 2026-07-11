"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuthModal } from "@/components/auth/auth-modal-context";
import { useStore } from "@/components/store/store-context";
import { useCart } from "@/components/cart/cart-context";

interface CheckoutPanelProps {
  readonly discountCode?: string;
  readonly discountAmount?: number;
  readonly onSuccess: (orderNumber: string) => void;
}

export function CheckoutPanel({ discountCode, discountAmount, onSuccess }: CheckoutPanelProps) {
  const { items, clear } = useCart();
  const { createOrder } = useStore();
  const { user } = useAuthModal();
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      if (user.phone) {
        setPhone(user.phone);
      }
    }
  }, [user]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!name.trim() || !phone.trim()) {
      setError("Vui lòng điền đầy đủ thông tin liên hệ.");
      return;
    }

    const order = createOrder({
      userId: user?.id,
      customerName: name,
      customerPhone: phone,
      customerEmail: email.trim() || undefined,
      notes,
      discountCode,
      discountAmount,
      lines: items.map((line) => ({
        id: line.product.id,
        quantity: line.quantity,
      })),
    });

    if (!order) {
      setError("Không thể tạo đơn hàng. Vui lòng thử lại.");
      return;
    }

    clear();
    onSuccess(order.orderNumber);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4 border-t border-border pt-6">
      <h3 className="text-sm font-semibold uppercase tracking-label text-foreground">
        Thông tin đặt hàng
      </h3>
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Họ và tên"
        className={INPUT_CLASS}
      />
      <input
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
        placeholder="Số điện thoại"
        className={INPUT_CLASS}
      />
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Email (tuỳ chọn)"
        className={INPUT_CLASS}
      />
      <textarea
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        placeholder="Ghi chú (tuỳ chọn)"
        rows={3}
        className={`${INPUT_CLASS} min-h-24 py-3`}
      />
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
      <Button type="submit" size="lg" className="w-full">
        Xác nhận đặt hàng
      </Button>
    </form>
  );
}

const INPUT_CLASS =
  "w-full rounded-card border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-foreground";
