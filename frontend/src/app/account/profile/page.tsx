"use client";

import Link from "next/link";
import {
  SyntheticEvent,
  useEffect,
  useState,
} from "react";

import { ApiError } from "@/lib/api";
import {
  changeCurrentUserPassword,
  updateCurrentUser,
} from "@/services/auth-service";
import { useAuthStore } from "@/store/auth-store";

export default function ProfilePage() {
  const token =
    useAuthStore(
      (state) => state.token,
    );

  const user =
    useAuthStore(
      (state) => state.user,
    );

  const setSession =
    useAuthStore(
      (state) => state.setSession,
    );

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [
    currentPassword,
    setCurrentPassword,
  ] = useState("");

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [isSaving, setIsSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      return;
    }

    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone ?? "");
  }, [user]);

  async function handleProfileSubmit(
    event: SyntheticEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!token) {
      return;
    }

    setIsSaving(true);
    setError(null);
    setMessage(null);

    try {
      const updated =
        await updateCurrentUser(
          token,
          {
            name: name.trim(),
            email: email.trim(),
            phone:
              phone.trim() ||
              null,
          },
        );

      setSession(
        token,
        updated,
      );

      setMessage(
        "Profile updated successfully.",
      );
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Unable to update your profile.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handlePasswordSubmit(
    event: SyntheticEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!token) {
      return;
    }

    if (
      newPassword !==
      confirmPassword
    ) {
      setError(
        "New passwords do not match.",
      );
      return;
    }

    setIsSaving(true);
    setError(null);
    setMessage(null);

    try {
      await changeCurrentUserPassword(
        token,
        {
          current_password:
            currentPassword,
          new_password:
            newPassword,
        },
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setMessage(
        "Password changed successfully.",
      );
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Unable to change your password.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (!token || !user) {
    return (
      <main className="container py-20">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-3xl font-semibold text-[#3F312B]">
            Login Required
          </h1>

          <p className="mt-4 text-gray-600">
            Log in to manage your profile.
          </p>

          <Link
            href="/account/login"
            className="mt-7 inline-block rounded-full bg-[#D88C9A] px-7 py-3 text-white"
          >
            Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-16">
      <div className="mx-auto max-w-2xl">
        <div>
          <Link
            href="/account"
            className="text-sm text-pink-500"
          >
            ← My Account
          </Link>

          <h1 className="mt-4 text-3xl font-semibold text-[#3F312B]">
            Profile Settings
          </h1>
        </div>

        {error && (
          <p
            role="alert"
            className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        {message && (
          <p className="mt-6 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </p>
        )}

        <form
          onSubmit={
            handleProfileSubmit
          }
          className="mt-8 rounded-2xl border border-pink-100 bg-white p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900">
            Personal Information
          </h2>

          <div className="mt-5 space-y-4">
            <label className="block text-sm text-gray-700">
              Name

              <input
                required
                minLength={2}
                maxLength={100}
                value={name}
                onChange={(event) =>
                  setName(
                    event.target.value,
                  )
                }
                className="mt-1 w-full rounded-lg border px-4 py-3"
              />
            </label>

            <label className="block text-sm text-gray-700">
              Email

              <input
                required
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(
                    event.target.value,
                  )
                }
                className="mt-1 w-full rounded-lg border px-4 py-3"
              />
            </label>

            <label className="block text-sm text-gray-700">
              Phone

              <input
                type="tel"
                maxLength={20}
                value={phone}
                onChange={(event) =>
                  setPhone(
                    event.target.value,
                  )
                }
                className="mt-1 w-full rounded-lg border px-4 py-3"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="mt-6 rounded-full bg-[#D88C9A] px-6 py-3 text-white disabled:opacity-50"
          >
            {isSaving
              ? "Saving..."
              : "Save Profile"}
          </button>
        </form>

        <form
          onSubmit={
            handlePasswordSubmit
          }
          className="mt-8 rounded-2xl border border-pink-100 bg-white p-6"
        >
          <h2 className="text-xl font-semibold text-gray-900">
            Change Password
          </h2>

          <div className="mt-5 space-y-4">
            <label className="block text-sm text-gray-700">
              Current password

              <input
                required
                type="password"
                value={
                  currentPassword
                }
                onChange={(event) =>
                  setCurrentPassword(
                    event.target.value,
                  )
                }
                className="mt-1 w-full rounded-lg border px-4 py-3"
              />
            </label>

            <label className="block text-sm text-gray-700">
              New password

              <input
                required
                type="password"
                minLength={8}
                maxLength={72}
                value={newPassword}
                onChange={(event) =>
                  setNewPassword(
                    event.target.value,
                  )
                }
                className="mt-1 w-full rounded-lg border px-4 py-3"
              />
            </label>

            <label className="block text-sm text-gray-700">
              Confirm new password

              <input
                required
                type="password"
                minLength={8}
                maxLength={72}
                value={
                  confirmPassword
                }
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value,
                  )
                }
                className="mt-1 w-full rounded-lg border px-4 py-3"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="mt-6 rounded-full bg-gray-900 px-6 py-3 text-white disabled:opacity-50"
          >
            {isSaving
              ? "Saving..."
              : "Change Password"}
          </button>
        </form>
      </div>
    </main>
  );
}
