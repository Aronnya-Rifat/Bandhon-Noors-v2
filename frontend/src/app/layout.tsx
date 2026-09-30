import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";

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
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
