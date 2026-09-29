/**
 * Bandhon Noors Cart Drawer
 *
 * Right side shopping cart panel.
 *
 * Features planned:
 * - Cart items
 * - Quantity update
 * - Remove item
 * - Checkout redirect
 */

"use client";
import { useCartStore } from "@/store/cart-store";
import { useRouter } from "next/navigation";

interface CartDrawerProps {
  open: boolean;

  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const items = useCartStore((state) => state.items);
  const router = useRouter();

  const removeItem = useCartStore((state) => state.removeItem);

  const updateQuantity = useCartStore((state) => state.updateQuantity);

  const clearCart = useCartStore((state) => state.clearCart);
  return (
    <>
      {/* Overlay */}

      <div
        className={`
          fixed
          inset-0
          bg-black/20
          z-40
          transition-opacity
          ${open ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
        onClick={onClose}
      />

      {/* Drawer */}

      <aside
        className={`
          fixed
          top-0
          right-0
          h-full
          w-full
          max-w-md
          bg-white
          z-50
          shadow-xl
          transition-transform
          duration-300

          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div
          className="
            flex
            items-center
            justify-between
            p-6
            border-b
          "
        >
          <h2
            className="
              text-xl
              font-semibold
              text-gray-800
            "
          >
            Your Cart
          </h2>

          <button
            onClick={onClose}
            className="
              text-gray-500
              hover:text-pink-500
            "
          >
            ✕
          </button>
        </div>

        {/* Empty Cart State */}
        <div
          className="
            flex
            flex-col
            h-[calc(100%-88px)]
            p-6
        "
        >
          {items.length === 0 ? (
            <div
              className="
                flex
                flex-1
                items-center
                justify-center
                text-gray-500
            "
            >
              Your cart is empty.
            </div>
          ) : (
            <>
              {/* Cart Items */}

              <div
                className="
                flex-1
                overflow-y-auto
                space-y-5
                "
              >
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="
                        border-b
                        border-pink-100
                        pb-5
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
                            mt-1
                        "
                    >
                      {item.variant.color_theme}
                      {" / "}
                      {item.variant.size}
                    </p>

                    <p
                      className="
                            mt-2
                            text-pink-500
                        "
                    >
                      ৳{item.product.price}
                    </p>

                    {/* Quantity */}

                    <div
                      className="
                            flex
                            items-center
                            gap-3
                            mt-3
                        "
                    >
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            Math.max(1, item.quantity - 1),
                          )
                        }
                        className="
                            w-8
                            h-8
                            border
                            rounded-full
                            "
                      >
                        -
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="
                            w-8
                            h-8
                            border
                            rounded-full
                            "
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="
                            mt-3
                            text-sm
                            text-red-400
                        "
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}

              <div
                className="
    border-t
    pt-5
    mt-6
  "
              >
                <div
                  className="
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
                      (total, item) =>
                        total + item.product.price * item.quantity,

                      0,
                    )}
                  </span>
                </div>

                <button
                  onClick={() => clearCart()}
                  className="
      mt-3
      text-sm
      text-red-400
    "
                >
                  Clear Cart
                </button>

                <button
                  onClick={() => {
                    onClose();

                    router.push("/checkout");
                  }}
                  className="
      mt-6
      w-full
      py-3
      rounded-full
      bg-[#D88C9A]
      hover:bg-[#C97B89]
      text-white
    "
                >
                  Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  );
}
