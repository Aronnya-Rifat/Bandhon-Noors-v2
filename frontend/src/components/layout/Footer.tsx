/**
 * Bandhon Noors Footer Component
 *
 * Global footer for customer pages.
 *
 * Contains:
 * - Brand information
 * - Navigation links
 * - Policies
 * - Social links
 */

import Link from "next/link";

import { siteConfig } from "@/config/site";

export default function Footer() {
  return (
    <footer
      className="
        bg-[#FCE4EC]
        mt-20
      "
    >
      <div
        className="
          container
          py-12
        "
      >
        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-4
            gap-10
          "
        >
          {/* Brand */}

          <div>
            <h3
              className="
                text-xl
                font-semibold
                text-[#693367]
                mb-4
              "
            >
              {siteConfig.name}
            </h3>

            <p
              className="
                text-sm
                text-gray-600
                leading-6
              "
            >
              {siteConfig.description}
            </p>
          </div>

          {/* Company */}

          <div>
            <h4
              className="
                
                font-medium
                text-[#3F312B]
                mb-4
              "
            >
              Company
            </h4>

            <ul
              className="
                space-y-3
              "
            >
              {siteConfig.footerLinks.company.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="
                        text-sm
                        text-gray-600
                        hover:text-pink-500
                      "
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}

          <div>
            <h4
              className="
                font-medium
                text-[#3F312B]
                mb-4
              "
            >
              Policies
            </h4>

            <ul
              className="
                space-y-3
              "
            >
              {siteConfig.footerLinks.policies.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="
                        text-sm
                        text-gray-600
                        hover:text-pink-500
                      "
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}

          <div>
            <h4
              className="
                font-medium
                text-[#3F312B]
                mb-4
              "
            >
              Contact
            </h4>

            <p
              className="
                text-sm
                text-gray-600
              "
            >
              Email:
              <br />
              {siteConfig.contact.email || "Coming soon"}
            </p>

            <p
              className="
                text-sm
                text-gray-600
                mt-3
              "
            >
              Phone:
              <br />
              {siteConfig.contact.phone || "Coming soon"}
            </p>
          </div>
        </div>

        {/* Bottom */}

        <div
          className="
            border-t
            border-pink-200
            mt-10
            pt-6
            text-center
          "
        >
          <p
            className="
              text-sm
              text-gray-500
            "
          >
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
