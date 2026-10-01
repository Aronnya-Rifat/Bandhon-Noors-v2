"use client";

import { useState } from "react";

import { ApiError } from "@/lib/api";
import { verifyAdminManualPayment } from "@/services/admin-service";

import type { Order } from "@/types/order";

interface AdminPaymentVerifierProps {
  token: string;
  order: Order;
  onUpdated: (order: Order) => void;
}

const paymentMethodLabels = {
  BKASH: "bKash",
  NAGAD: "Nagad",
} as const;

export default function AdminPaymentVerifier({
  token,
  order,
  onUpdated,
}: AdminPaymentVerifierProps) {
  const [note, setNote] = useState(
    order.payment?.verification_note ?? "",
  );

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [error, setError] = useState<
    string | null
  >(null);

  const payment = order.payment;

  if (
    !payment ||
    (
      payment.payment_method !== "BKASH" &&
      payment.payment_method !== "NAGAD"
    )
  ) {
    return null;
  }

  const isPending =
    payment.payment_status === "PENDING";

  async function reviewPayment(
    decision: "APPROVE" | "REJECT",
  ) {
    if (
      decision === "APPROVE" &&
      !window.confirm(
        `Confirm payment for order #${order.id}?`,
      )
    ) {
      return;
    }

    if (
      decision === "REJECT" &&
      !window.confirm(
        `Reject payment for order #${order.id}? The order will be cancelled and its stock will be returned.`,
      )
    ) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const updated =
        await verifyAdminManualPayment(
          token,
          order.id,
          {
            decision,
            note: note.trim() || undefined,
          },
        );

      onUpdated(updated);
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Unable to review payment.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {
              paymentMethodLabels[
                payment.payment_method
              ]
            } payment
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Customer submitted payment details
          </p>
        </div>

        <span
          className={`
            rounded-full px-3 py-1 text-xs font-medium
            ${
              payment.payment_status === "SUCCESS"
                ? "bg-green-100 text-green-700"
                : payment.payment_status === "FAILED"
                  ? "bg-red-100 text-red-700"
                  : "bg-amber-100 text-amber-700"
            }
          `}
        >
          {payment.payment_status}
        </span>
      </div>

      <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
        <div className="rounded-md bg-white p-2">
          <dt className="text-xs text-gray-500">
            Sender number
          </dt>

          <dd className="mt-1 font-medium text-gray-900">
            {payment.sender_number || "Not provided"}
          </dd>
        </div>

        <div className="rounded-md bg-white p-2">
          <dt className="text-xs text-gray-500">
            Transaction ID
          </dt>

          <dd className="mt-1 break-all font-mono font-medium text-gray-900">
            {payment.transaction_id || "Not provided"}
          </dd>
        </div>
      </dl>

      {isPending ? (
        <>
          <label className="mt-3 block text-xs font-medium text-gray-700">
            Admin note
          </label>

          <textarea
            value={note}
            onChange={(event) =>
              setNote(event.target.value)
            }
            maxLength={500}
            rows={2}
            placeholder="Optional verification note"
            className="mt-1 w-full resize-y rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-pink-400"
          />

          {error && (
            <p
              role="alert"
              className="mt-2 text-xs text-red-600"
            >
              {error}
            </p>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => {
                void reviewPayment("APPROVE");
              }}
              className="rounded-md bg-green-600 px-3 py-2 text-xs font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting
                ? "Updating..."
                : "Confirm payment"}
            </button>

            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => {
                void reviewPayment("REJECT");
              }}
              className="rounded-md border border-red-300 bg-white px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Reject payment
            </button>
          </div>
        </>
      ) : (
        <div className="mt-3 border-t border-gray-200 pt-3 text-xs text-gray-600">
          <p>
            Reviewed:{" "}
            {payment.verified_at
              ? new Date(
                  payment.verified_at,
                ).toLocaleString("en-BD")
              : "Date unavailable"}
          </p>

          {payment.verification_note && (
            <p className="mt-1">
              Note: {payment.verification_note}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
