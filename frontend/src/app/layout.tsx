import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartProvider from "@/components/cart/CartProvider";

export const metadata: Metadata = {
  title: {
    default: "Bandhon Noors",
    template: "%s | Bandhon Noors",
  },

  description:
    "Premium traditional clothing inspired by Bengali heritage and modern elegance.",

  keywords: [
    "Bandhon Noors",
    "Bangladeshi clothing",
    "traditional dress",
    "saree",
    "panjabi",
    "fashion",
  ],

  openGraph: {
    title: "Bandhon Noors",
    description:
      "Premium traditional clothing inspired by Bengali heritage and modern elegance.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />

        <CartProvider />

        <main>
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
