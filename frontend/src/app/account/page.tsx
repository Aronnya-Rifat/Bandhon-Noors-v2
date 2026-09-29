/**
 * Bandhon Noors Account Page
 *
 * Customer account area.
 *
 * Future:
 * - Orders
 * - Profile
 * - Saved addresses
 * - Wishlist
 */


import Link from "next/link";


export default function AccountPage() {


  return (

    <main
      className="
        container
        py-20
      "
    >

      <div
        className="
          max-w-md
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

          My Account

        </h1>



        <p
          className="
            mt-4
            text-gray-600
          "
        >

          Manage your orders, profile, and preferences.

        </p>



        <div
          className="
            mt-8
            flex
            flex-col
            gap-4
          "
        >

          <Link
            href="/account/login"
            className="
              rounded-full
              bg-[#D88C9A]
              text-white
              py-3
              hover:bg-[#C97B89]
              transition
            "
          >

            Login

          </Link>



          <Link
            href="/account/register"
            className="
              rounded-full
              border
              border-[#E7B8C1]
              py-3
              text-pink-500
            "
          >

            Create Account

          </Link>
          <Link
            href="/account/orders"
            className="
                rounded-full
                border
                border-pink-200
                py-3
                text-gray-700
            "
            >

            My Orders

            </Link>


        </div>


      </div>


    </main>

  );

}
