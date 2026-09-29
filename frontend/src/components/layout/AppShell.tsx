"use client";

import { usePathname } from "next/navigation";

import CartProvider from "@/components/cart/CartProvider";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({
  children,
}: AppShellProps) {
  const pathname = usePathname();

  const isAdminPage =
    pathname === "/admin" ||
    pathname.startsWith("/admin/");

  if (isAdminPage) {
    return children;
  }

  return (
    <>
      <Header />

      <CartProvider />

      <main>{children}</main>

      <Footer />
    </>
  );
}
