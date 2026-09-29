"use client";

import {
  SyntheticEvent,
  useEffect,
  useState,
} from "react";

import { ApiError } from "@/lib/api";
import {
  createAdminInvitation,
  getAdminInvitations,
  getAdminStaff,
  reviewAdminInvitation,
  updateAdminStaffStatus,
} from "@/services/admin-service";
import { useAuthStore } from "@/store/auth-store";
import type {
  AdminInvitation,
  AdminStaffUser,
} from "@/types/admin";

export default function AdminStaffPage() {
  const token =
    useAuthStore(
      (state) => state.token,
    );

  const user =
    useAuthStore(
      (state) => state.user,
    );

  const isSuperAdmin =
    user?.role === "SUPER_ADMIN";

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [reason, setReason] =
    useState("");

  const [staff, setStaff] =
    useState<AdminStaffUser[]>([]);

  const [invitations, setInvitations] =
    useState<AdminInvitation[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isWorking, setIsWorking] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      return;
    }

    if (!isSuperAdmin) {
      setIsLoading(false);
      return;
    }

    const accessToken = token;
    let cancelled = false;

    async function loadStaffData() {
      try {
        const [
          staffData,
          invitationData,
        ] = await Promise.all([
          getAdminStaff(
            accessToken,
          ),
          getAdminInvitations(
            accessToken,
          ),
        ]);

        if (!cancelled) {
          setStaff(staffData);
          setInvitations(
            invitationData,
          );
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

    void loadStaffData();

    return () => {
      cancelled = true;
    };
  }, [
    token,
    isSuperAdmin,
  ]);

  async function handleInvite(
    event: SyntheticEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!token) {
      return;
    }

    setIsWorking(true);
    setError(null);
    setMessage(null);

    try {
      const invitation =
        await createAdminInvitation(
          token,
          {
            email: email.trim(),
            name:
              name.trim() ||
              undefined,
            reason:
              reason.trim(),
          },
        );

      if (isSuperAdmin) {
        setInvitations(
          (current) => [
            invitation,
            ...current,
          ],
        );
      }

      setName("");
      setEmail("");
      setReason("");

      setMessage(
        isSuperAdmin
          ? "Invitation request created. You can now review it below."
          : "Invitation request sent to the super administrator.",
      );
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Unable to create the invitation.",
      );
    } finally {
      setIsWorking(false);
    }
  }

  async function handleReview(
    invitationId: number,
    decision:
      | "approve"
      | "reject",
  ) {
    if (!token) {
      return;
    }

    setIsWorking(true);
    setError(null);

    try {
      const updated =
        await reviewAdminInvitation(
          token,
          invitationId,
          decision,
        );

      setInvitations((current) =>
        current.map(
          (invitation) =>
            invitation.id ===
            updated.id
              ? updated
              : invitation,
        ),
      );
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Unable to review the invitation.",
      );
    } finally {
      setIsWorking(false);
    }
  }

  async function handleStaffStatus(
    admin: AdminStaffUser,
  ) {
    if (!token) {
      return;
    }

    setIsWorking(true);
    setError(null);

    try {
      const updated =
        await updateAdminStaffStatus(
          token,
          admin.id,
          !admin.is_active,
        );

      setStaff((current) =>
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
          : "Unable to update the administrator.",
      );
    } finally {
      setIsWorking(false);
    }
  }

  return (
    <main className="w-full px-4 py-8 md:px-8">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Staff
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Request and manage administrator access.
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
        onSubmit={handleInvite}
        className="mt-6 border border-gray-200 bg-white p-5"
      >
        <h2 className="font-semibold text-gray-900">
          Request administrator access
        </h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="text-sm text-gray-700">
            Name
            <input
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value,
                )
              }
              className="mt-1 w-full border px-3 py-2"
            />
          </label>

          <label className="text-sm text-gray-700">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value,
                )
              }
              className="mt-1 w-full border px-3 py-2"
            />
          </label>

          <label className="text-sm text-gray-700 md:col-span-2">
            Reason
            <textarea
              required
              minLength={10}
              maxLength={500}
              value={reason}
              onChange={(event) =>
                setReason(
                  event.target.value,
                )
              }
              rows={3}
              className="mt-1 w-full border px-3 py-2"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={isWorking}
          className="mt-4 bg-gray-900 px-5 py-2 text-sm text-white disabled:opacity-50"
        >
          Submit request
        </button>
      </form>

      {isSuperAdmin && (
        <>
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
                    {staff.map(
                      (admin) => (
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
                            {admin.role}
                          </td>
                          <td className="px-4 py-3">
                            {admin.is_active
                              ? "Active"
                              : "Inactive"}
                          </td>
                          <td className="px-4 py-3">
                            {admin.role ===
                            "ADMIN" ? (
                              <button
                                type="button"
                                disabled={
                                  isWorking
                                }
                                onClick={() =>
                                  void handleStaffStatus(
                                    admin,
                                  )
                                }
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
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900">
              Invitation requests
            </h2>

            <div className="mt-4 space-y-3">
              {invitations.map(
                (invitation) => (
                  <article
                    key={invitation.id}
                    className="border border-gray-200 bg-white p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {invitation.name ??
                            invitation.email}
                        </p>

                        <p className="text-sm text-gray-500">
                          {invitation.email}
                        </p>

                        <p className="mt-2 text-sm text-gray-700">
                          {invitation.reason}
                        </p>

                        <p className="mt-2 text-xs text-gray-500">
                          Status:{" "}
                          {invitation.status}
                        </p>
                      </div>

                      {invitation.status ===
                        "PENDING" && (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={
                              isWorking
                            }
                            onClick={() =>
                              void handleReview(
                                invitation.id,
                                "approve",
                              )
                            }
                            className="bg-green-700 px-3 py-2 text-xs text-white"
                          >
                            Approve
                          </button>

                          <button
                            type="button"
                            disabled={
                              isWorking
                            }
                            onClick={() =>
                              void handleReview(
                                invitation.id,
                                "reject",
                              )
                            }
                            className="border border-red-200 px-3 py-2 text-xs text-red-600"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </article>
                ),
              )}
            </div>
          </section>
        </>
      )}
    </main>
  );
}
