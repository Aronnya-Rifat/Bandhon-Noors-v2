/**
 * Bandhon Noors Order Confirmation
 *
 * Shown after successful checkout.
 *
 * Future:
 * - Show real order number
 * - Track order
 * - Payment status
 */


import Link from "next/link";


export default function OrderConfirmationPage() {


  return (

    <main
      className="
        container
        py-20
      "
    >

      <div
        className="
          max-w-lg
          mx-auto
          text-center
        "
      >


        <h1
          className="
            text-3xl
            font-semibold
            text-[#3F312B]
          "
        >

          Thank You For Your Order

        </h1>



        <p
          className="
            mt-5
            text-gray-600
          "
        >

          Your order has been placed successfully.

        </p>



        <Link
          href="/"
          className="
                inline-block
                mt-8
                px-8
                py-3
                rounded-full
                bg-[#D88C9A]
                hover:bg-[#C97B89]
                text-white
                transition
            "
        >

          Continue Shopping

        </Link>


      </div>


    </main>

  );

}
