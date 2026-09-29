"use client";
/**
 * Bandhon Noors Header Component
 *
 * Main customer navigation.
 *
 * Contains:
 * - Logo
 * - Navigation links
 * - Search
 * - Account
 * - Cart trigger
 */


import Link from "next/link";
import { useState } from "react";
import SearchOverlay from "@/components/search/SearchOverlay";
import {
  Menu,
  Search,
  User,
  ShoppingBag,
} from "lucide-react";

import MobileMenu from "@/components/layout/MobileMenu";
import { siteConfig } from "@/config/site";
import Image from "next/image";
import { useCartStore } from "@/store/cart-store";


export default function Header() {

    const openCart =
    useCartStore(
      (state) => state.openCart
    );
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] =
    useState(false);
    const items =
    useCartStore(
      (state) => state.items
    );

  return (
    <>
    <header
      className="
        w-full
        bg-white
        border-b
        border-pink-100
      "
    >

      <div
        className="
          container
          flex
          items-center
          justify-between
          h-20
        "
      >
      {/* Mobile Menu Button */}

        <button

        onClick={() =>
            setMenuOpen(true)
        }

        className="
            md:hidden
            text-gray-700
        "

        aria-label="Open menu"

        >

        <Menu
            size={24}
        />

        </button>


        {/* Logo */}

        
    <Link
        href="/"
        className="
            flex
            items-center
            py-2
        "
    >

        <Image
            src={siteConfig.logo.src}
            alt={siteConfig.logo.alt}
            width={220}
            height={80}
            priority
            className="h-auto w-[120px]"
        />

    </Link>



        {/* Navigation */}

        <nav
          className="
            hidden
            md:flex
            items-center
            gap-8
          "
        >

          {siteConfig.navigation.map(
            (item) => (

              <Link
                key={item.name}
                href={item.href}
                className="
                text-base
                font-semibold
                text-[#4A3B36]
                hover:text-[#D88C9A]
                transition
              "
              >

                {item.name}

              </Link>

            )
          )}

        </nav>



        {/* Actions */}

        <div
          className="
            flex
            items-center
            gap-5
          "
        >


          {/* Search */}

          <button
            aria-label="Search"
            onClick={() =>
                setSearchOpen(true)
            }
            className="
                flex
                items-center
                gap-2
                text-gray-600
                hover:text-pink-400
            "
            >

            <Search
                size={20}
            />


            <span
                className="
                hidden
                md:inline
                "
            >
                Search
            </span>

            </button>



          {/* Account */}

          <Link
            href="/account"
            className="
                flex
                items-center
                gap-2
                text-gray-600
                hover:text-pink-400
            "
            >

            <User
                size={20}
            />


            <span
                className="
                hidden
                md:inline
                "
            >
                Account
            </span>

            </Link>



          {/* Cart */}

          <button

            aria-label="Open cart"

            onClick={openCart}

            className="
                relative
                flex
                items-center
                gap-2
                text-gray-600
                hover:text-pink-400
            "

            >

            <ShoppingBag
                size={20}
            />


            <span
                className="
                hidden
                md:inline
                "
            >
                Cart
            </span>



            {
                items.length > 0 && (

                <span
                    className="
                    absolute
                    -top-2
                    -right-3
                    w-5
                    h-5
                    rounded-full
                    bg-pink-400
                    text-white
                    text-xs
                    flex
                    items-center
                    justify-center
                    "
                >

                    {items.length}

                </span>

                )
            }


            </button>


        </div>


      </div>

    </header>
    <MobileMenu

        open={menuOpen}
        onClose={() =>
            setMenuOpen(false)
        }

        />
    
    <SearchOverlay

        open={searchOpen}

        onClose={() =>
            setSearchOpen(false)
        }

        />

    
    </>
  );
}
