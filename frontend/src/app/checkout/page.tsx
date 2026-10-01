"use client";

import Link from "next/link";
import { SubmitEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { ApiError } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import {
  createCustomerAddress,
  getCustomerAddresses,
} from "@/services/address-service";
import { createCustomerOrder } from "@/services/order-service";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";
import type { CustomerAddress } from "@/types/address";
import type {
  DeliveryArea,
  PaymentMethod,
  PaymentOptions,
} from "@/types/order";
import { getPaymentOptions } from "@/services/payment-service";

export default function CheckoutPage() {
  const router = useRouter();

  const token = useAuthStore((state) => state.token);

  const user = useAuthStore((state) => state.user);

  const items = useCartStore((state) => state.items);

  const clearCart = useCartStore((state) => state.clearCart);

  const [addresses, setAddresses] = useState<CustomerAddress[]>([]);

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );

  const [useNewAddress, setUseNewAddress] = useState(false);

  const [fullName, setFullName] = useState("");

  const [phone, setPhone] = useState("");

  const [addressLine, setAddressLine] = useState("");

  const [city, setCity] = useState("");

  const [postalCode, setPostalCode] = useState("");

  const [deliveryArea, setDeliveryArea] = useState<DeliveryArea>("DHAKA");

  const [isLoading, setIsLoading] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [paymentOptions, setPaymentOptions] = useState<PaymentOptions | null>(
    null,
  );

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod>("COD");

  const [senderNumber, setSenderNumber] = useState("");

  const [transactionId, setTransactionId] = useState("");
  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    const accessToken = token;

    let cancelled = false;

    async function loadAddresses() {
      try {
        const customerAddresses = await getCustomerAddresses(accessToken);

        if (cancelled) {
          return;
        }

        setAddresses(customerAddresses);

        const defaultAddress =
          customerAddresses.find((address) => address.is_default) ??
          customerAddresses[0];

        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
        } else {
          setUseNewAddress(true);
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(
            requestError instanceof ApiError
              ? requestError.message
              : "Unable to load your addresses.",
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
    let cancelled = false;

    async function loadPaymentOptions() {
      try {
        const options = await getPaymentOptions();

        if (!cancelled) {
          setPaymentOptions(options);
        }
      } catch (requestError) {
        if (!cancelled) {
          setError(
            requestError instanceof ApiError
              ? requestError.message
              : "Unable to load payment methods.",
          );
        }
      }
    }

    void loadPaymentOptions();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (user) {
      setFullName(user.name);
      setPhone(user.phone ?? "");
    }
  }, [user]);

  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  const deliveryCharge = deliveryArea === "DHAKA" ? 80 : 150;
  const isManualPayment =
    selectedPaymentMethod === "BKASH" || selectedPaymentMethod === "NAGAD";

  const selectedManualOption =
    selectedPaymentMethod === "BKASH"
      ? paymentOptions?.bkash
      : selectedPaymentMethod === "NAGAD"
        ? paymentOptions?.nagad
        : null;
  async function handlePlaceOrder(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      router.push("/account/login");
      return;
    }

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    if (isManualPayment && (!senderNumber.trim() || !transactionId.trim())) {
      setError("Enter the sender number and transaction ID.");

      return;
    }
    setError(null);
    setIsSubmitting(true);

    try {
      let addressId = selectedAddressId;

      if (useNewAddress || addressId === null) {
        if (
          !fullName.trim() ||
          !phone.trim() ||
          !addressLine.trim() ||
          !city.trim()
        ) {
          setError("Please complete the shipping address.");

          return;
        }

        const address = await createCustomerAddress(token, {
          full_name: fullName.trim(),
          phone: phone.trim(),
          address_line: addressLine.trim(),
          city: city.trim(),
          postal_code: postalCode.trim() || undefined,
          is_default: addresses.length === 0,
        });

        addressId = address.id;
      }

      const order = await createCustomerOrder(token, {
        address_id: addressId,
        delivery_area: deliveryArea,
        payment_method: selectedPaymentMethod,
        ...(isManualPayment
          ? {
              sender_number: senderNumber.trim(),
              transaction_id: transactionId.trim(),
            }
          : {}),
      });

      clearCart();

      router.push(`/order-confirmation?order=${order.id}`);
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Unable to place your order.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!token) {
    return (
      <main className="container py-20">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-3xl font-semibold text-[#3F312B]">
            Login Required
          </h1>

          <p className="mt-4 text-gray-600">
            Please log in before completing your order.
          </p>

          <Link
            href="/account/login"
            className="
              mt-8
              inline-block
              rounded-full
              bg-[#D88C9A]
              px-8
              py-3
              text-white
            "
          >
            Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-16">
      <h1 className="text-3xl font-semibold text-[#3F312B]">Checkout</h1>

      <form
        onSubmit={handlePlaceOrder}
        className="
          mt-10
          grid
          grid-cols-1
          gap-10
          lg:grid-cols-3
        "
      >
        <section className="space-y-8 lg:col-span-2">
          <div className="rounded-2xl border border-pink-100 p-6">
            <h2 className="text-xl font-medium text-gray-800">
              Customer Information
            </h2>

            <p className="mt-4 text-gray-700">{user?.name}</p>

            <p className="mt-1 text-sm text-gray-500">{user?.email}</p>
          </div>

          <div className="rounded-2xl border border-pink-100 p-6">
            <h2 className="text-xl font-medium text-gray-800">
              Shipping Address
            </h2>

            {isLoading ? (
              <p className="mt-5 text-gray-500">Loading addresses...</p>
            ) : (
              <>
                {addresses.length > 0 && (
                  <div className="mt-5 space-y-3">
                    {addresses.map((address) => (
                      <label
                        key={address.id}
                        className="
                            flex
                            cursor-pointer
                            gap-3
                            rounded-xl
                            border
                            border-pink-100
                            p-4
                          "
                      >
                        <input
                          type="radio"
                          name="address"
                          checked={
                            !useNewAddress && selectedAddressId === address.id
                          }
                          onChange={() => {
                            setUseNewAddress(false);

                            setSelectedAddressId(address.id);
                          }}
                        />

                        <span>
                          <span className="block font-medium text-gray-800">
                            {address.full_name}
                          </span>

                          <span className="mt-1 block text-sm text-gray-600">
                            {address.phone}
                          </span>

                          <span className="block text-sm text-gray-600">
                            {address.address_line}, {address.city}
                            {address.postal_code
                              ? `, ${address.postal_code}`
                              : ""}
                          </span>
                        </span>
                      </label>
                    ))}

                    <label className="flex cursor-pointer items-center gap-3">
                      <input
                        type="radio"
                        name="address"
                        checked={useNewAddress}
                        onChange={() => setUseNewAddress(true)}
                      />
                      Use a new address
                    </label>
                  </div>
                )}

                {(useNewAddress || addresses.length === 0) && (
                  <div className="mt-5 space-y-4">
                    <input
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      required
                      placeholder="Full name"
                      className="w-full rounded-lg border px-4 py-3"
                    />

                    <input
                      type="tel"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      required
                      placeholder="Phone number"
                      className="w-full rounded-lg border px-4 py-3"
                    />

                    <textarea
                      value={addressLine}
                      onChange={(event) => setAddressLine(event.target.value)}
                      required
                      placeholder="Address"
                      className="h-28 w-full rounded-lg border px-4 py-3"
                    />

                    <input
                      value={city}
                      onChange={(event) => setCity(event.target.value)}
                      required
                      placeholder="City"
                      className="w-full rounded-lg border px-4 py-3"
                    />

                    <input
                      value={postalCode}
                      onChange={(event) => setPostalCode(event.target.value)}
                      placeholder="Postal code (optional)"
                      className="w-full rounded-lg border px-4 py-3"
                    />
                  </div>
                )}
              </>
            )}
          </div>

          <div className="rounded-2xl border border-pink-100 p-6">
            <h2 className="text-xl font-medium text-gray-800">
              Delivery Location
            </h2>

            <div className="mt-5 space-y-3">
              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="delivery"
                  checked={deliveryArea === "DHAKA"}
                  onChange={() => setDeliveryArea("DHAKA")}
                />
                Dhaka
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="delivery"
                  checked={deliveryArea === "OUTSIDE"}
                  onChange={() => setDeliveryArea("OUTSIDE")}
                />
                Outside Dhaka
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-pink-100 p-6">
            <h2 className="text-xl font-medium text-gray-800">
              Payment Method
            </h2>

            <div className="mt-5 space-y-3">
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-pink-100 p-4">
                <input
                  type="radio"
                  name="payment-method"
                  value="COD"
                  checked={selectedPaymentMethod === "COD"}
                  onChange={() => {
                    setSelectedPaymentMethod("COD");
                    setError(null);
                  }}
                />

                <span className="font-medium text-gray-800">
                  Cash on Delivery
                </span>
              </label>

              <label
                className={`flex items-center gap-3 rounded-xl border p-4 ${
                  paymentOptions?.bkash.enabled
                    ? "cursor-pointer border-pink-100"
                    : "cursor-not-allowed border-gray-200 bg-gray-50 opacity-60"
                }`}
              >
                <input
                  type="radio"
                  name="payment-method"
                  value="BKASH"
                  disabled={!paymentOptions?.bkash.enabled}
                  checked={selectedPaymentMethod === "BKASH"}
                  onChange={() => {
                    setSelectedPaymentMethod("BKASH");
                    setError(null);
                  }}
                />

                <span>
                  <span className="block font-medium text-gray-800">
                    bKash Send Money
                  </span>

                  {!paymentOptions?.bkash.enabled && (
                    <span className="mt-1 block text-xs text-gray-500">
                      Currently unavailable
                    </span>
                  )}
                </span>
              </label>

              <label
                className={`flex items-center gap-3 rounded-xl border p-4 ${
                  paymentOptions?.nagad.enabled
                    ? "cursor-pointer border-pink-100"
                    : "cursor-not-allowed border-gray-200 bg-gray-50 opacity-60"
                }`}
              >
                <input
                  type="radio"
                  name="payment-method"
                  value="NAGAD"
                  disabled={!paymentOptions?.nagad.enabled}
                  checked={selectedPaymentMethod === "NAGAD"}
                  onChange={() => {
                    setSelectedPaymentMethod("NAGAD");
                    setError(null);
                  }}
                />

                <span>
                  <span className="block font-medium text-gray-800">
                    Nagad Send Money
                  </span>

                  {!paymentOptions?.nagad.enabled && (
                    <span className="mt-1 block text-xs text-gray-500">
                      Currently unavailable
                    </span>
                  )}
                </span>
              </label>

              {isManualPayment && selectedManualOption && (
                <div className="rounded-xl border border-pink-200 bg-pink-50 p-5">
                  <p className="text-sm text-gray-700">
                    Send exactly{" "}
                    <strong>{formatCurrency(subtotal + deliveryCharge)}</strong>{" "}
                    to:
                  </p>

                  <p className="mt-2 text-xl font-semibold tracking-wide text-pink-700">
                    {selectedManualOption.number}
                  </p>

                  <p className="mt-2 text-xs leading-5 text-gray-600">
                    {selectedManualOption.instructions}
                  </p>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <label className="text-sm text-gray-700">
                      Sender number
                      <input
                        type="tel"
                        value={senderNumber}
                        onChange={(event) =>
                          setSenderNumber(event.target.value)
                        }
                        required={isManualPayment}
                        placeholder="01XXXXXXXXX"
                        className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 outline-none focus:border-pink-300"
                      />
                    </label>

                    <label className="text-sm text-gray-700">
                      Transaction ID
                      <input
                        value={transactionId}
                        onChange={(event) =>
                          setTransactionId(event.target.value)
                        }
                        required={isManualPayment}
                        placeholder="Transaction ID"
                        className="mt-2 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 uppercase outline-none focus:border-pink-300"
                      />
                    </label>
                  </div>

                  <p className="mt-4 text-xs leading-5 text-amber-700">
                    Your order will remain pending until an administrator
                    verifies the payment.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4 opacity-60">
                <span className="font-medium text-gray-700">Bank and Card</span>

                <span className="text-xs font-medium text-amber-700">
                  Coming with SSLCOMMERZ
                </span>
              </div>
            </div>
          </div>
        </section>

        <aside className="h-fit rounded-2xl border border-pink-100 p-6">
          <h2 className="text-xl font-medium text-gray-800">Order Summary</h2>

          <div className="mt-5 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="border-b border-pink-100 pb-4">
                <h3 className="font-medium text-gray-800">
                  {item.product.name}
                </h3>

                <p className="text-sm text-gray-500">
                  {[item.variant.color_theme, item.variant.size]
                    .filter(Boolean)
                    .join(" / ") || "Standard option"}
                </p>

                <div className="mt-2 flex justify-between text-sm">
                  <span>Qty: {item.quantity}</span>

                  <span>
                    {formatCurrency(item.product.price * item.quantity)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between font-semibold text-gray-800">
            <span>Subtotal</span>

            <span>{formatCurrency(subtotal)}</span>
          </div>

          <div className="mt-3 flex justify-between text-gray-600">
            <span>Delivery</span>

            <span>{formatCurrency(deliveryCharge)}</span>
          </div>

          <div className="mt-4 flex justify-between border-t pt-4 text-lg font-semibold text-gray-800">
            <span>Total</span>

            <span>{formatCurrency(subtotal + deliveryCharge)}</span>
          </div>

          {error && (
            <p role="alert" className="mt-5 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting || isLoading || items.length === 0}
            className="
              mt-8
              w-full
              rounded-full
              bg-[#D88C9A]
              py-3
              text-white
              transition
              hover:bg-[#C97B89]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {isSubmitting ? "Placing Order..." : "Place Order"}
          </button>
        </aside>
      </form>
    </main>
  );
}
