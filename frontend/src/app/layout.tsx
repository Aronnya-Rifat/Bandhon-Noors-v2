import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
    siteName: "Bandhon Noors",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Bandhon Noors",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bandhon Noors",
    description:
      "Premium traditional clothing inspired by Bengali heritage and modern elegance.",
    images: ["/logo.png"],
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
