"use client";

import Link from "next/link";
import {
  SubmitEvent,
  useEffect,
  useState,
} from "react";

import { ApiError } from "@/lib/api";
import {
  createCustomerAddress,
  deleteCustomerAddress,
  getCustomerAddresses,
  updateCustomerAddress,
} from "@/services/address-service";
import { useAuthStore } from "@/store/auth-store";
import type { CustomerAddress } from "@/types/address";

export default function AddressesPage() {
  const token =
    useAuthStore(
      (state) => state.token,
    );

  const user =
    useAuthStore(
      (state) => state.user,
    );

  const [addresses, setAddresses] =
    useState<CustomerAddress[]>([]);

  const [fullName, setFullName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [addressLine, setAddressLine] =
    useState("");

  const [city, setCity] =
    useState("");

  const [postalCode, setPostalCode] =
    useState("");

  const [isLoading, setIsLoading] =
    useState(true);

  const [isWorking, setIsWorking] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    const accessToken = token;

    let cancelled = false;

    async function loadAddresses() {
      try {
        const customerAddresses =
          await getCustomerAddresses(
            accessToken,
          );

        if (!cancelled) {
          setAddresses(
            customerAddresses,
          );
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(
            requestError instanceof ApiError
              ? requestError.message
              : "Unable to load addresses.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadAddresses();

    return () => {
      cancelled = true;
    };
  }, [token]);

  useEffect(() => {
    if (user) {
      setFullName(user.name);
      setPhone(user.phone ?? "");
    }
  }, [user]);

  async function refreshAddresses(
    accessToken: string,
  ) {
    const customerAddresses =
      await getCustomerAddresses(
        accessToken,
      );

    setAddresses(customerAddresses);
  }

  async function handleCreate(
    event: SubmitEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!token) {
      return;
    }

    const accessToken = token;

    setError(null);
    setIsWorking(true);

    try {
      await createCustomerAddress(
        accessToken,
        {
          full_name: fullName.trim(),
          phone: phone.trim(),
          address_line:
            addressLine.trim(),
          city: city.trim(),
          postal_code:
            postalCode.trim() ||
            undefined,
          is_default:
            addresses.length === 0,
        },
      );

      await refreshAddresses(
        accessToken,
      );

      setAddressLine("");
      setCity("");
      setPostalCode("");
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Unable to save the address.",
      );
    } finally {
      setIsWorking(false);
    }
  }

  async function handleSetDefault(
    addressId: number,
  ) {
    if (!token) {
      return;
    }

    const accessToken = token;

    setError(null);
    setIsWorking(true);

    try {
      await updateCustomerAddress(
        accessToken,
        addressId,
        {
          is_default: true,
        },
      );

      await refreshAddresses(
        accessToken,
      );
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Unable to update the address.",
      );
    } finally {
      setIsWorking(false);
    }
  }

  async function handleDelete(
    addressId: number,
  ) {
    if (!token) {
      return;
    }

    const shouldDelete =
      window.confirm(
        "Remove this saved address?",
      );

    if (!shouldDelete) {
      return;
    }

    const accessToken = token;

    setError(null);
    setIsWorking(true);

    try {
      await deleteCustomerAddress(
        accessToken,
        addressId,
      );

      await refreshAddresses(
        accessToken,
      );
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Unable to remove the address.",
      );
    } finally {
      setIsWorking(false);
    }
  }

  if (!token) {
    return (
      <main className="container py-20">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-3xl font-semibold text-[#3F312B]">
            Saved Addresses
          </h1>

          <p className="mt-5 text-gray-600">
            Please log in to manage your addresses.
          </p>

          <Link
            href="/account/login"
            className="mt-8 inline-block rounded-full bg-[#D88C9A] px-8 py-3 text-white"
          >
            Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-20">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-semibold text-[#3F312B]">
            Saved Addresses
          </h1>

          <Link
            href="/account"
            className="text-sm text-pink-500 hover:underline"
          >
            Back to Account
          </Link>
        </div>

        {error && (
          <p
            role="alert"
            className="mt-6 text-sm text-red-600"
          >
            {error}
          </p>
        )}

        <section className="mt-10">
          <h2 className="text-xl font-medium text-gray-800">
            Your Addresses
          </h2>

          {isLoading ? (
            <p className="mt-5 text-gray-500">
              Loading addresses...
            </p>
          ) : addresses.length === 0 ? (
            <p className="mt-5 text-gray-500">
              You have no saved addresses.
            </p>
          ) : (
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {addresses.map(
                (address) => (
                  <article
                    key={address.id}
                    className="rounded-2xl border border-pink-100 p-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-medium text-gray-800">
                        {address.full_name}
                      </h3>

                      {address.is_default && (
                        <span className="rounded-full bg-pink-50 px-3 py-1 text-xs text-pink-600">
                          Default
                        </span>
                      )}
                    </div>

                    <p className="mt-3 text-sm text-gray-600">
                      {address.phone}
                    </p>

                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      {address.address_line}
                      <br />
                      {address.city}
                      {address.postal_code
                        ? `, ${address.postal_code}`
                        : ""}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-4">
                      {!address.is_default && (
                        <button
                          type="button"
                          disabled={isWorking}
                          onClick={() =>
                            void handleSetDefault(
                              address.id,
                            )
                          }
                          className="text-sm text-pink-500 disabled:opacity-50"
                        >
                          Make Default
                        </button>
                      )}

                      <button
                        type="button"
                        disabled={isWorking}
                        onClick={() =>
                          void handleDelete(
                            address.id,
                          )
                        }
                        className="text-sm text-red-500 disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  </article>
                ),
              )}
            </div>
          )}
        </section>

        <section className="mt-12 rounded-2xl border border-pink-100 p-6">
          <h2 className="text-xl font-medium text-gray-800">
            Add New Address
          </h2>

          <form
            onSubmit={handleCreate}
            className="mt-6 space-y-4"
          >
            <input
              value={fullName}
              onChange={(event) =>
                setFullName(
                  event.target.value,
                )
              }
              required
              placeholder="Full name"
              className="w-full rounded-lg border px-4 py-3"
            />

            <input
              type="tel"
              value={phone}
              onChange={(event) =>
                setPhone(
                  event.target.value,
                )
              }
              required
              placeholder="Phone number"
              className="w-full rounded-lg border px-4 py-3"
            />

            <textarea
              value={addressLine}
              onChange={(event) =>
                setAddressLine(
                  event.target.value,
                )
              }
              required
              placeholder="Address"
              className="h-28 w-full rounded-lg border px-4 py-3"
            />

            <input
              value={city}
              onChange={(event) =>
                setCity(
                  event.target.value,
                )
              }
              required
              placeholder="City"
              className="w-full rounded-lg border px-4 py-3"
            />

            <input
              value={postalCode}
              onChange={(event) =>
                setPostalCode(
                  event.target.value,
                )
              }
              placeholder="Postal code (optional)"
              className="w-full rounded-lg border px-4 py-3"
            />

            <button
              type="submit"
              disabled={isWorking}
              className="
                rounded-full
                bg-[#D88C9A]
                px-8
                py-3
                text-white
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {isWorking
                ? "Saving..."
                : "Save Address"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
