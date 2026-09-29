/**
 * Bandhon Noors Mobile Menu
 *
 * Mobile navigation drawer.
 *
 * Contains:
 * - Main navigation links
 * - Account
 * - Cart
 *
 * Future:
 * - Category submenu
 * - Search
 */


"use client";


import Link from "next/link";
import { siteConfig } from "@/config/site";
import { useAuthStore } from "@/store/auth-store";

interface MobileMenuProps {

  open: boolean;

  onClose: () => void;

}



export default function MobileMenu({
  open,
  onClose,
}: MobileMenuProps) {
  const user =
    useAuthStore(
      (state) => state.user,
    );

  const accountHref =
    user?.role === "ADMIN" ||
    user?.role === "SUPER_ADMIN"
      ? "/admin"
      : "/account";

  const accountLabel =
    user?.role === "ADMIN" ||
    user?.role === "SUPER_ADMIN"
      ? "Admin Dashboard"
      : "Account";




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

          ${
            open
              ? "opacity-100"
              : "opacity-0 pointer-events-none"
          }
        `}
        onClick={onClose}
      />



      {/* Menu */}

      <aside
        className={`
          fixed
          top-0
          left-0
          h-full
          w-72
          bg-white
          z-50
          shadow-xl
          transition-transform
          duration-300

          ${
            open
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >


        <div
          className="
            flex
            items-center
            justify-between
            p-6
            border-b
            border-pink-100
          "
        >

          <h2
            className="
              text-xl
              font-semibold
              text-gray-800
            "
          >
            Menu
          </h2>


          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="
              text-gray-500
              hover:text-pink-400
            "
          >

            ✕

          </button>


        </div>



        <nav
          className="
            p-6
            space-y-5
          "
        >

          {
            siteConfig.navigation.map(
              (item) => (

                <Link

                  key={item.name}

                  href={item.href}

                  onClick={onClose}

                  className="
                    block
                    text-[#4A3B36]
                    text-base
                    font-medium
                    hover:text-[#D88C9A]
                    transition
                  "

                >

                  {item.name}

                </Link>

              )
            )
          }



          <div
            className="
              border-t
              border-pink-100
              pt-5
            "
          >

            <Link
              href={accountHref}
              onClick={onClose}
              className="
                block
                text-gray-700
                hover:text-pink-400
              "
            >

              {accountLabel}

            </Link>


          </div>


        </nav>


      </aside>


    </>

  );

}
