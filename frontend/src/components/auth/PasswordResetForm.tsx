"use client";

import Link from "next/link";
import {
  useState,
  type SyntheticEvent,
} from "react";

import { ApiError } from "@/lib/api";
import {
  confirmPasswordReset,
} from "@/services/auth-service";


export default function PasswordResetForm({
  token,
}: {
  token: string;
}) {
  const [password, setPassword] =
    useState("");

  const [confirmation, setConfirmation] =
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

    if (password !== confirmation) {
      setError(
        "Passwords do not match.",
      );
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result =
        await confirmPasswordReset({
          token,
          new_password: password,
        });

      setMessage(result.message);
      setPassword("");
      setConfirmation("");
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Unable to reset the password.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!token) {
    return (
      <p className="text-sm text-red-600">
        This reset link is invalid.
      </p>
    );
  }

  return (
    <>
      {message ? (
        <div>
          <p className="text-sm text-green-700">
            {message}
          </p>

          <Link
            href="/account/login"
            className="mt-6 inline-block text-pink-600"
          >
            Continue to login
          </Link>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <input
            type="password"
            required
            minLength={8}
            maxLength={72}
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            autoComplete="new-password"
            placeholder="New password"
            className="w-full rounded-lg border px-4 py-3"
          />

          <input
            type="password"
            required
            minLength={8}
            maxLength={72}
            value={confirmation}
            onChange={(event) =>
              setConfirmation(event.target.value)
            }
            autoComplete="new-password"
            placeholder="Confirm new password"
            className="w-full rounded-lg border px-4 py-3"
          />

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
              ? "Resetting..."
              : "Reset password"}
          </button>
        </form>
      )}
    </>
  );
}
