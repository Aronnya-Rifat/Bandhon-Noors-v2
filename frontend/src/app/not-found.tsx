import {
  ArrowLeft,
  Home,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="container flex min-h-[65vh] items-center justify-center py-16">
      <div className="max-w-xl text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-rose-500">
          Error 404
        </p>

        <h1 className="mt-4 text-4xl font-semibold text-[#3F312B] md:text-5xl">
          Page Not Found
        </h1>

        <p className="mt-5 leading-7 text-gray-600">
          The page may have moved, the
          link may be incorrect, or the
          content may no longer be
          available.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full bg-[#D88C9A] px-6 py-3 text-white transition hover:bg-[#C97B89]"
          >
            <Home size={18} />

            Homepage
          </Link>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 rounded-full border border-pink-200 px-6 py-3 text-gray-700 transition hover:bg-pink-50"
          >
            <ShoppingBag size={18} />

            Shop Products
          </Link>

          <Link
            href="/collections"
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 px-6 py-3 text-gray-700 transition hover:bg-gray-50"
          >
            <ArrowLeft size={18} />

            Collections
          </Link>
        </div>
      </div>
    </main>
  );
}
