"use client";

import {
  Home,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import {
  useEffect,
} from "react";

interface ErrorPageProps {
  error: Error & {
    digest?: string;
  };

  reset: () => void;
}

export default function ErrorPage({
  error,
  reset,
}: ErrorPageProps) {
  useEffect(() => {
    console.error(
      "Application page error:",
      error,
    );
  }, [error]);

  return (
    <main className="container flex min-h-[65vh] items-center justify-center py-16">
      <div className="max-w-xl text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-rose-500">
          Something Went Wrong
        </p>

        <h1 className="mt-4 text-4xl font-semibold text-[#3F312B]">
          We Couldn’t Load This Page
        </h1>

        <p className="mt-5 leading-7 text-gray-600">
          A temporary problem prevented
          the page from loading. Try
          again, or return to the
          homepage.
        </p>

        {error.digest && (
          <p className="mt-3 text-xs text-gray-400">
            Reference: {error.digest}
          </p>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 rounded-full bg-[#D88C9A] px-6 py-3 text-white transition hover:bg-[#C97B89]"
          >
            <RefreshCw size={18} />

            Try Again
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-pink-200 px-6 py-3 text-gray-700 transition hover:bg-pink-50"
          >
            <Home size={18} />

            Homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
