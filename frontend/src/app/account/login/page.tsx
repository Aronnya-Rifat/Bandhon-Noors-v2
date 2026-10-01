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
} from "@/services/auth-service";
import { useAuthStore } from "@/store/auth-store";

export default function LoginPage() {
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
      const currentUser =
        useAuthStore.getState().user;

      router.replace(
        currentUser &&
          currentUser.role !== "CUSTOMER"
          ? "/admin"
          : "/account",
      );
    }
  }, [token, router]);
  const [login, setLogin] =
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
      const tokenResponse =
        await loginCustomer({
          login: login.trim(),
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

      const destination =
        authenticatedUser.must_change_password
          ? "/account/profile"
          : authenticatedUser.role === "ADMIN" ||
              authenticatedUser.role === "SUPER_ADMIN"
            ? "/admin"
            : "/account";

      router.push(destination);
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Unable to log in. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="container py-20">
      <div className="mx-auto max-w-md">
        <h1 className="text-3xl font-semibold text-[#3F312B]">
          Login
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >
          <div>
            <label
              htmlFor="login"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email or phone number
            </label>

            <input
              id="login"
              value={login}
              onChange={(event) =>
                setLogin(event.target.value)
              }
              autoComplete="username"
              required
              placeholder="Email or phone number"
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              autoComplete="current-password"
              minLength={8}
              required
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

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
              ? "Logging in..."
              : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/account/register"
            className="text-pink-500 hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
