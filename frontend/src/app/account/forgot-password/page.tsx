"use client";

import Link from "next/link";
import {
  useState,
  type SyntheticEvent,
} from "react";

import { ApiError } from "@/lib/api";
import {
  requestPasswordReset,
} from "@/services/auth-service";


export default function ForgotPasswordPage() {
  const [email, setEmail] =
    useState("");

  const [message, setMessage] =
    useState<string | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  async function handleSubmit(
    event: SyntheticEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      const result =
        await requestPasswordReset({
          email: email.trim(),
        });

      setMessage(result.message);
      setEmail("");
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Unable to request a password reset.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="container py-20">
      <div className="mx-auto max-w-md">
        <h1 className="text-3xl font-semibold text-[#3F312B]">
          Reset Password
        </h1>

        <p className="mt-3 text-sm text-gray-600">
          Enter your account email to receive a reset link.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            autoComplete="email"
            placeholder="Email"
            className="w-full rounded-lg border px-4 py-3"
          />

          {message && (
            <p className="text-sm text-green-700">
              {message}
            </p>
          )}

          {error && (
            <p
              role="alert"
              className="text-sm text-red-600"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-[#D88C9A] py-3 text-white disabled:opacity-60"
          >
            {isSubmitting
              ? "Sending..."
              : "Send reset link"}
          </button>
        </form>

        <Link
          href="/account/login"
          className="mt-6 block text-center text-sm text-pink-600"
        >
          Return to login
        </Link>
      </div>
    </main>
  );
}
