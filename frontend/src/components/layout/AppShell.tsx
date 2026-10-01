"use client";
import AuthProvider from "@/components/auth/AuthProvider";
import { usePathname } from "next/navigation";
import ChatWidget from "@/components/chat/ChatWidget";
import CartProvider from "@/components/cart/CartProvider";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import WishlistProvider from "@/components/wishlist/WishlistProvider";
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
    return (
      <>
        <AuthProvider />
        {children}
      </>
    );
  }
  return (
    <>
      <AuthProvider />
      
      <Header />

      <CartProvider />

      <WishlistProvider />

      <ChatWidget />

      <main>{children}</main>

      <Footer />
    </>
  );
}
