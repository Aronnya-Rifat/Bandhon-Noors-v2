"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  SubmitEvent,
  useEffect,
  useState,
} from "react";

import { ApiError } from "@/lib/api";
import {
  getCurrentUser,
  loginCustomer,
  registerCustomer,
} from "@/services/auth-service";
import { useAuthStore } from "@/store/auth-store";

export default function RegisterPage() {
  const router = useRouter();

  const setSession =
    useAuthStore(
      (state) => state.setSession,
    );
  const token =
    useAuthStore(
      (state) => state.token,
    );

  useEffect(() => {
    if (token) {
      router.replace("/account");
    }
  }, [token, router]);
  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  async function handleSubmit(
    event: SubmitEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError(null);
    setIsSubmitting(true);

    try {
      await registerCustomer({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        password,
      });

      const tokenResponse =
        await loginCustomer({
          login: email.trim(),
          password,
        });

      const authenticatedUser =
        await getCurrentUser(
          tokenResponse.access_token,
        );

      setSession(
        tokenResponse.access_token,
        authenticatedUser,
      );

      router.push(
        authenticatedUser.role === "CUSTOMER"
          ? "/account"
          : "/admin",
      );

      router.push("/account");
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Unable to create your account.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="container py-20">
      <div className="mx-auto max-w-md">
        <h1 className="text-3xl font-semibold text-[#3F312B]">
          Create Account
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >
          <input
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            autoComplete="name"
            minLength={2}
            required
            placeholder="Full name"
            className="w-full rounded-lg border px-4 py-3"
          />

          <input
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            autoComplete="email"
            required
            placeholder="Email"
            className="w-full rounded-lg border px-4 py-3"
          />

          <input
            type="tel"
            value={phone}
            onChange={(event) =>
              setPhone(event.target.value)
            }
            autoComplete="tel"
            placeholder="Phone number (optional)"
            className="w-full rounded-lg border px-4 py-3"
          />

          <input
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            autoComplete="new-password"
            minLength={8}
            maxLength={72}
            required
            placeholder="Password"
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
            className="
              w-full
              rounded-full
              bg-[#D88C9A]
              py-3
              text-white
              transition
              hover:bg-[#C97B89]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            {isSubmitting
              ? "Creating account..."
              : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/account/login"
            className="text-pink-500 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
