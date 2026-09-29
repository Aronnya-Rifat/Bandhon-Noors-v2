/**
 * Bandhon Noors Checkout Page
 *
 * Checkout flow foundation.
 *
 * Handles:
 * - Customer information
 * - Shipping address
 * - Payment selection
 *
 * Future:
 * - Create order API
 * - SSLCommerz integration
 * - Order confirmation
 */
"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart-store";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);

  const [deliveryArea, setDeliveryArea] = useState<"DHAKA" | "OUTSIDE">(
    "DHAKA",
  );

  const deliveryCharge =
    deliveryArea === "DHAKA" ? 80 : 150; /*Delivery Charges*/

  const router = useRouter();

  const clearCart = useCartStore((state) => state.clearCart);
  function handlePlaceOrder() {
    /*
        Future:

        POST /orders

      */

    clearCart();

    router.push("/order-confirmation");
  }

  return (
    <main
      className="
        container
        py-16
      "
    >
      <h1
        className="
          text-3xl
          font-semibold
          text-[#3F312B]
        "
      >
        Checkout
      </h1>

      <div
        className="
          mt-10
          grid
          grid-cols-1
          lg:grid-cols-3
          gap-10
        "
      >
        {/* Customer Details */}

        <section
          className="
            lg:col-span-2
            space-y-8
          "
        >
          <div
            className="
              border
              border-pink-100
              rounded-2xl
              p-6
            "
          >
            <h2
              className="
                text-xl
                font-medium
                text-gray-800
              "
            >
              Customer Information
            </h2>

            <div
              className="
                mt-5
                space-y-4
              "
            >
              <input
                placeholder="Full Name"
                className="
                  w-full
                  border
                  rounded-lg
                  px-4
                  py-3
                "
              />

              <input
                placeholder="Phone Number"
                className="
                  w-full
                  border
                  rounded-lg
                  px-4
                  py-3
                "
              />

              <input
                placeholder="Email"
                className="
                  w-full
                  border
                  rounded-lg
                  px-4
                  py-3
                "
              />
            </div>
          </div>

          {/* Shipping Address */}

          <div
            className="
              border
              border-pink-100
              rounded-2xl
              p-6
            "
          >
            <h2
              className="
                text-xl
                font-medium
                text-gray-800
              "
            >
              Shipping Address
            </h2>

            <textarea
              placeholder="Address"
              className="
                mt-5
                w-full
                h-32
                border
                rounded-lg
                px-4
                py-3
              "
            />
          </div>
          {/* Delivery Area */}

          <div
            className="
                border
                border-pink-100
                rounded-2xl
                p-6
            "
          >
            <h2
              className="
                text-xl
                font-medium
                text-gray-800
                "
            >
              Delivery Location
            </h2>

            <div
              className="
                mt-5
                space-y-3
                "
            >
              <label
                className="
                    flex
                    items-center
                    gap-3
                "
              >
                <input
                  type="radio"
                  name="delivery"
                  checked={deliveryArea === "DHAKA"}
                  onChange={() => setDeliveryArea("DHAKA")}
                />
                Dhaka
              </label>

              <label
                className="
                    flex
                    items-center
                    gap-3
                "
              >
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
          {/* Payment */}

          <div
            className="
              border
              border-pink-100
              rounded-2xl
              p-6
            "
          >
            <h2
              className="
                text-xl
                font-medium
                text-gray-800
              "
            >
              Payment Method
            </h2>

            <div
              className="
                mt-5
                space-y-3
              "
            >
              <label>
                <input type="radio" name="payment" defaultChecked />

                <span className="ml-3">Cash on Delivery</span>
              </label>

              <label className="block">
                <input type="radio" name="payment" />

                <span className="ml-3">Card Payment</span>
              </label>
            </div>
          </div>
        </section>

        {/* Order Summary */}

        <aside
          className="
            border
            border-pink-100
            rounded-2xl
            p-6
            h-fit
          "
        >
          <h2
            className="
              text-xl
              font-medium
              text-gray-800
            "
          >
            Order Summary
          </h2>

          <div
            className="
                mt-5
                space-y-4
            "
          >
            {items.length === 0 ? (
              <p
                className="
                    text-gray-500
                "
              >
                Your cart is empty.
              </p>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="
            border-b
            border-pink-100
            pb-4
          "
                >
                  <h3
                    className="
              font-medium
              text-gray-800
            "
                  >
                    {item.product.name}
                  </h3>

                  <p
                    className="
              text-sm
              text-gray-500
            "
                  >
                    {item.variant.color_theme}

                    {" / "}

                    {item.variant.size}
                  </p>

                  <div
                    className="
              flex
              justify-between
              mt-2
              text-sm
            "
                  >
                    <span>Qty: {item.quantity}</span>

                    <span>৳{item.product.price * item.quantity}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div
            className="
            mt-6
            flex
            justify-between
            font-semibold
            text-gray-800
            "
          >
            <span>Subtotal</span>

            <span>
              ৳
              {items.reduce(
                (total, item) => total + item.product.price * item.quantity,

                0,
              )}
            </span>
          </div>

          <div
            className="
                mt-3
                flex
                justify-between
                text-gray-600
            "
          >
            <span>Delivery</span>

            <span>৳{deliveryCharge}</span>
          </div>

          <div
            className="
    mt-4
    pt-4
    border-t
    flex
    justify-between
    text-lg
    font-semibold
    text-gray-800
  "
          >
            <span>Total</span>

            <span>
              ৳
              {items.reduce(
                (total, item) => total + item.product.price * item.quantity,

                0,
              ) + deliveryCharge}
            </span>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="
    mt-8
    w-full
    py-3
    rounded-full
    bg-[#D88C9A]
    hover:bg-[#C97B89]
    text-white
    transition
  "
          >
            Place Order
          </button>
        </aside>
      </div>
    </main>
  );
}
