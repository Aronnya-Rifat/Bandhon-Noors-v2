"use client";

import AdminSidebar from "@/components/admin/AdminSidebar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useWishlistStore } from "@/store/wishlist-store";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const resetWishlist = useWishlistStore((state) => state.resetWishlist);
  const [mounted, setMounted] = useState(false);

  const token = useAuthStore((state) => state.token);

  const user = useAuthStore((state) => state.user);

  const clearSession = useAuthStore((state) => state.clearSession);

  const resetCart = useCartStore((state) => state.resetCart);

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }
    if (token && isAdmin && user?.must_change_password) {
      router.replace("/account/profile");

      return;
    }

    if (!token || !isAdmin) {
      router.replace("/account/login");
    }
  }, [mounted, token, user, isAdmin, router]);

  function handleLogout() {
    clearSession();
    resetCart();
    resetWishlist();

    router.replace("/account/login");
  }

  if (!mounted || !token || !isAdmin) {
    return (
      <div className="p-10 text-center text-gray-500">Loading admin...</div>
    );
  }
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar onLogout={handleLogout} />

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
