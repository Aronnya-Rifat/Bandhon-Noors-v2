"use client";

import {
  useState,
  type SyntheticEvent,
} from "react";

import { ApiError } from "@/lib/api";
import {
  updateAdminOrderShipment,
} from "@/services/admin-service";

import type {
  AdminOrder,
  Order,
} from "@/types/order";


interface AdminShipmentEditorProps {
  token: string;
  order: AdminOrder;

  onUpdated: (
    order: Order,
  ) => void;
}


export default function AdminShipmentEditor({
  token,
  order,
  onUpdated,
}: AdminShipmentEditorProps) {
  const [courier, setCourier] =
    useState(
      order.courier_name ?? "",
    );

  const [tracking, setTracking] =
    useState(
      order.tracking_number ?? "",
    );

  const [isSaving, setIsSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function handleSubmit(
    event: SyntheticEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setIsSaving(true);
    setError(null);

    try {
      const updated =
        await updateAdminOrderShipment(
          token,
          order.id,
          {
            courier_name:
              courier.trim(),
            tracking_number:
              tracking.trim(),
          },
        );

      onUpdated(updated);
    } catch (requestError) {
      setError(
        requestError instanceof ApiError
          ? requestError.message
          : "Unable to save shipment details.",
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (
    order.status === "DELIVERED" ||
    order.status === "CANCELLED"
  ) {
    return null;
  }

  return (
    <details className="mt-3 border-t border-gray-100 pt-3">
      <summary className="cursor-pointer text-sm font-medium text-pink-600">
        Courier and tracking
      </summary>

      <form
        onSubmit={handleSubmit}
        className="mt-3 grid gap-3"
      >
        <input
          required
          minLength={2}
          maxLength={100}
          value={courier}
          onChange={(event) =>
            setCourier(
              event.target.value,
            )
          }
          placeholder="Courier name"
          className="border px-3 py-2 text-sm"
        />

        <input
          required
          minLength={2}
          maxLength={150}
          value={tracking}
          onChange={(event) =>
            setTracking(
              event.target.value,
            )
          }
          placeholder="Tracking number"
          className="border px-3 py-2 text-sm"
        />

        {error && (
          <p className="text-xs text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSaving}
          className="w-fit bg-gray-900 px-4 py-2 text-xs text-white disabled:opacity-50"
        >
          {isSaving
            ? "Saving..."
            : "Save tracking"}
        </button>
      </form>
    </details>
  );
}
