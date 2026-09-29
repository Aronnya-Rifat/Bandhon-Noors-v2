import { formatCurrency } from "@/lib/utils";
import type { Order } from "@/types/order";

interface OrderSummaryCardProps {
  order: Order;
  showAddress?: boolean;
  defaultExpanded?: boolean;
}

const statusLabels: Record<Order["status"], string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};
const paymentMethodLabels = {
  COD: "Cash on Delivery",
  CARD: "Card",
  MOBILE_BANKING: "Mobile Banking",
} as const;

const paymentStatusLabels = {
  PENDING: "Pending",
  SUCCESS: "Paid",
  FAILED: "Failed",
  REFUNDED: "Refunded",
} as const;

export default function OrderSummaryCard({
  order,
  showAddress = false,
  defaultExpanded = false,
}: OrderSummaryCardProps) {
  return (
    <article className="rounded-xl border border-pink-100 bg-white">
      <div className="flex items-center justify-between gap-3 p-4">
        <div>
          <h2 className="font-semibold text-gray-800">Order #{order.id}</h2>

          <p className="mt-1 text-sm text-gray-500">
            {new Date(order.created_at).toLocaleDateString("en-BD", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="text-right">
          <p className="font-semibold text-gray-800">
            {formatCurrency(order.total_amount)}
          </p>

          <span className="mt-1 inline-block rounded-full bg-pink-50 px-3 py-1 text-xs font-medium text-pink-600">
            {statusLabels[order.status]}
          </span>
        </div>
      </div>

      <details open={defaultExpanded} className="border-t border-pink-100">
        <summary className="cursor-pointer px-4 py-2 text-sm font-medium text-pink-600">
          View order details
        </summary>

        <div className="border-t border-pink-50 px-4 pb-4 pt-3">
          <div className="space-y-3">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between gap-4 border-b border-pink-50 pb-3"
              >
                <div>
                  <p className="font-medium text-gray-800">
                    {item.product_name}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    {item.variant_info}
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Quantity: {item.quantity}
                  </p>
                </div>

                <p className="text-sm text-gray-700">
                  {formatCurrency(item.unit_price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>

              <span>{formatCurrency(order.subtotal)}</span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Delivery</span>

              <span>{formatCurrency(order.delivery_charge)}</span>
            </div>

            <div className="flex justify-between border-t border-pink-100 pt-3 font-semibold text-gray-800">
              <span>Total</span>

              <span>{formatCurrency(order.total_amount)}</span>
            </div>
          </div>
          <div className="mt-5 border-t border-pink-100 pt-4">
            <h3 className="text-sm font-medium text-gray-800">Payment</h3>

            {order.payment ? (
              <div className="mt-2 flex flex-wrap items-center justify-between gap-3 text-sm">
                <span className="text-gray-600">
                  {paymentMethodLabels[order.payment.payment_method]}
                </span>

                <span
                  className={`
          rounded-full px-3 py-1 text-xs font-medium
          ${
            order.payment.payment_status === "SUCCESS"
              ? "bg-green-50 text-green-700"
              : order.payment.payment_status === "FAILED"
                ? "bg-red-50 text-red-600"
                : "bg-amber-50 text-amber-700"
          }
        `}
                >
                  {paymentStatusLabels[order.payment.payment_status]}
                </span>
              </div>
            ) : (
              <p className="mt-2 text-sm text-gray-500">
                Payment was not recorded for this older order.
              </p>
            )}
          </div>
          {showAddress && (
            <div className="mt-5 rounded-lg bg-gray-50 p-4">
              <h3 className="text-sm font-medium text-gray-800">
                Shipping Address
              </h3>

              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-600">
                {order.shipping_address}
              </p>
            </div>
          )}
        </div>
      </details>
    </article>
  );
}
