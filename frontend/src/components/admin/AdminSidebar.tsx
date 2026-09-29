"use client";

import {
  Boxes,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Package,
  PanelsTopLeft,
  Users,
  UserCog,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface AdminSidebarProps {
  onLogout: () => void;
}

const navigationItems = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
  },

  {
    href: "/admin/orders",
    label: "Orders",
    icon: ClipboardList,
  },
  {
    href: "/admin/products",
    label: "Products",
    icon: Package,
  },
  {
    href: "/admin/categories",
    label: "Categories",
    icon: FolderTree,
  },
  {
    href: "/admin/customers",
    label: "Customers",
    icon: Users,
  },
  {
    href: "/admin/staff",
    label: "Staff",
    icon: UserCog,
  },
  {
    href: "/admin/inventory",
    label: "Inventory",
    icon: Boxes,
  },
  {
    href: "/admin/homepage",
    label: "Homepage",
    icon: PanelsTopLeft,
  },
];

export default function AdminSidebar({ onLogout }: AdminSidebarProps) {
  const pathname = usePathname();

  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setExpanded(window.innerWidth >= 768);
  }, []);

  function isCurrentPage(href: string) {
    if (href === "/admin") {
      return pathname === "/admin";
    }

    return pathname.startsWith(href);
  }

  return (
    <>
      {expanded && (
        <button
          type="button"
          aria-label="Close admin menu overlay"
          onClick={() => setExpanded(false)}
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-40
          flex flex-col
          border-r border-gray-200
          bg-white
          transition-[width] duration-200
          ${expanded ? "w-64" : "w-16"}
        `}
      >
        <div className="flex h-16 shrink-0 items-center border-b border-gray-200 px-3">
          {expanded ? (
            <Link
              href="/admin"
              className="min-w-0 flex-1 truncate font-semibold text-[#3F312B]"
            >
              Bandhon Noors Admin
            </Link>
          ) : (
            <Link
              href="/admin"
              aria-label="Bandhon Noors Admin"
              className="flex-1 text-center font-semibold text-[#3F312B]"
            >
              BN
            </Link>
          )}

          <button
            type="button"
            aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
            onClick={() => setExpanded((current) => !current)}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          >
            {expanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-2">
          {navigationItems.map(({ href, label, icon: Icon }) => {
            const active = isCurrentPage(href);

            return (
              <Link
                key={href}
                href={href}
                title={expanded ? undefined : label}
                className={`
                    flex h-11 items-center rounded-lg
                    transition
                    ${expanded ? "gap-3 px-3" : "justify-center px-0"}
                    ${
                      active
                        ? "bg-pink-50 text-pink-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }
                  `}
              >
                <Icon size={20} className="shrink-0" />

                {expanded && (
                  <span className="truncate text-sm font-medium">{label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-200 p-2">
          <button
            type="button"
            title={expanded ? undefined : "Logout"}
            onClick={onLogout}
            className={`
              flex h-11 w-full items-center rounded-lg
              text-red-600 hover:bg-red-50
              ${expanded ? "gap-3 px-3" : "justify-center px-0"}
            `}
          >
            <LogOut size={20} className="shrink-0" />

            {expanded && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      <div
        className={`
          shrink-0 transition-[width] duration-200
          ${expanded ? "w-16 md:w-64" : "w-16"}
        `}
      />
    </>
  );
}
