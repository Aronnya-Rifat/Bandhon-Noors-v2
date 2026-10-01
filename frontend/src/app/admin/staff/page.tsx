"use client";

import {
  useEffect,
  useState,
  type SyntheticEvent,
} from "react";

import { ApiError } from "@/lib/api";
import {
  createAdminStaff,
  getAdminStaff,
  updateAdminStaffStatus,
} from "@/services/admin-service";
import { useAuthStore } from "@/store/auth-store";

import type {
  AdminStaffUser,
} from "@/types/admin";


export default function AdminStaffPage() {
  const token = useAuthStore(
    (state) => state.token,
  );

  const user = useAuthStore(
    (state) => state.user,
  );

  const isSuperAdmin =
    user?.role === "SUPER_ADMIN";

  const [staff, setStaff] =
    useState<AdminStaffUser[]>([]);

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(true);

  const [isWorking, setIsWorking] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState<string | null>(null);

  useEffect(() => {
    if (!token || !isSuperAdmin) {
      return;
    }

    const accessToken = token;
    let cancelled = false;

    async function loadStaff() {
      try {
        const result =
          await getAdminStaff(
            accessToken,
          );

        if (!cancelled) {
          setStaff(result);
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(
            requestError instanceof ApiError
              ? requestError.message
              : "Unable to load staff.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadStaff();

    return () => {
      cancelled = true;
    };
  }, [
    token,
    isSuperAdmin,
  ]);

  async function handleCreate(
    event: SyntheticEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!token || !isSuperAdmin) {
      return;
    }

    setIsWorking(true);
    setError(null);
    setMessage(null);

    try {
      const created =
        await createAdminStaff(
          token,
          {
            name: name.trim(),
            email: email.trim(),
            phone:
              phone.trim() ||
              undefined,
            password,
          },
        );

      setStaff(
        (current) => [
          created,
          ...current,
        ],
      );

      setName("");
      setEmail("");
      setPhone("");
      setPassword("");

      setMessage(
        "Administrator account created.",
      );
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Unable to create administrator.",
      );
    } finally {
      setIsWorking(false);
    }
  }

  async function handleStatus(
    admin: AdminStaffUser,
  ) {
    if (!token || !isSuperAdmin) {
      return;
    }

    setIsWorking(true);
    setError(null);
    setMessage(null);

    try {
      const updated =
        await updateAdminStaffStatus(
          token,
          admin.id,
          !admin.is_active,
        );

      setStaff(
        (current) =>
          current.map(
            (item) =>
              item.id === updated.id
                ? updated
                : item,
          ),
      );
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Unable to update administrator.",
      );
    } finally {
      setIsWorking(false);
    }
  }

  if (!isSuperAdmin) {
    return (
      <main className="w-full px-4 py-8 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          Staff
        </h1>

        <p className="mt-5 border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Only the super administrator can manage staff accounts.
        </p>
      </main>
    );
  }

  return (
    <main className="w-full px-4 py-8 md:px-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Staff
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Create and manage administrator accounts.
        </p>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      {message && (
        <p className="mt-5 border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </p>
      )}

      <form
        onSubmit={handleCreate}
        className="mt-6 border border-gray-200 bg-white p-5"
      >
        <h2 className="font-semibold text-gray-900">
          Create administrator
        </h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="text-sm text-gray-700">
            Name
            <input
              required
              minLength={2}
              maxLength={100}
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              autoComplete="name"
              className="mt-1 w-full border px-3 py-2"
            />
          </label>

          <label className="text-sm text-gray-700">
            Email
            <input
              required
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              autoComplete="email"
              className="mt-1 w-full border px-3 py-2"
            />
          </label>

          <label className="text-sm text-gray-700">
            Phone
            <input
              type="tel"
              value={phone}
              onChange={(event) =>
                setPhone(event.target.value)
              }
              autoComplete="tel"
              className="mt-1 w-full border px-3 py-2"
            />
          </label>

          <label className="text-sm text-gray-700">
            Temporary password
            <input
              required
              type="password"
              minLength={8}
              maxLength={72}
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              autoComplete="new-password"
              className="mt-1 w-full border px-3 py-2"
            />
          </label>
        </div>

        <p className="mt-3 text-xs text-gray-500">
          Send the password securely. The administrator should change it after signing in.
        </p>

        <button
          type="submit"
          disabled={isWorking}
          className="mt-4 bg-gray-900 px-5 py-2 text-sm text-white disabled:opacity-50"
        >
          {isWorking
            ? "Creating..."
            : "Create administrator"}
        </button>
      </form>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900">
          Administrators
        </h2>

        {isLoading ? (
          <p className="mt-4 text-sm text-gray-500">
            Loading staff...
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto border bg-white">
            <table className="w-full min-w-[700px] text-left text-sm">
              <thead className="border-b bg-gray-100 text-gray-600">
                <tr>
                  <th className="px-4 py-3">
                    Name
                  </th>

                  <th className="px-4 py-3">
                    Email
                  </th>

                  <th className="px-4 py-3">
                    Phone
                  </th>

                  <th className="px-4 py-3">
                    Role
                  </th>

                  <th className="px-4 py-3">
                    Status
                  </th>

                  <th className="px-4 py-3">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {staff.map((admin) => (
                  <tr
                    key={admin.id}
                    className="border-b last:border-b-0"
                  >
                    <td className="px-4 py-3">
                      {admin.name}
                    </td>

                    <td className="px-4 py-3">
                      {admin.email}
                    </td>

                    <td className="px-4 py-3">
                      {admin.phone ?? "—"}
                    </td>

                    <td className="px-4 py-3">
                      {admin.role}
                    </td>

                    <td className="px-4 py-3">
                      {admin.is_active
                        ? "Active"
                        : "Inactive"}
                    </td>

                    <td className="px-4 py-3">
                      {admin.role === "ADMIN" ? (
                        <button
                          type="button"
                          disabled={isWorking}
                          onClick={() => {
                            void handleStatus(
                              admin,
                            );
                          }}
                          className="text-red-600 disabled:opacity-50"
                        >
                          {admin.is_active
                            ? "Deactivate"
                            : "Activate"}
                        </button>
                      ) : (
                        <span className="text-gray-400">
                          Protected
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
