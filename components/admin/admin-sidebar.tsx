"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  ImageIcon,
  FileText,
  Calendar,
  Settings,
  LogOut,
  Menu,
  X,
  Database,
  Home,
  Gift,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";

export function AdminSidebar() {
  const pathname = usePathname();
  const { signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: "Members",
      href: "/admin/members",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Gallery",
      href: "/admin/gallery",
      icon: <ImageIcon className="h-5 w-5" />,
    },
    {
      name: "Events",
      href: "/admin/events",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      name: "News",
      href: "/admin/news",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: "Donations",
      href: "/admin/donations",
      icon: <Gift className="h-5 w-5" />,
    },
    // {
    //   name: "Settings",
    //   href: "/admin/settings",
    //   icon: <Settings className="h-5 w-5" />,
    // },
    // {
    //   name: "Storage",
    //   href: "/admin/settings/storage",
    //   icon: <Database className="h-5 w-5" />,
    // },
  ];

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-primary text-white p-2 rounded-md"
        onClick={toggleSidebar}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      <aside
        className={`bg-gray-900 text-white w-64 min-h-screen flex-shrink-0 fixed md:static z-40 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-xl font-bold">CMAHS Admin</h1>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center p-3 rounded-md transition-colors ${
                    pathname === item.href
                      ? "bg-primary text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8 pt-4 border-t border-gray-800">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:bg-gray-800 hover:text-white p-3"
              onClick={() => signOut()}
            >
              <LogOut className="h-5 w-5 mr-3" />
              Logout
            </Button>
            <Link
              href="/"
              className={`flex items-center p-3 rounded-md transition-colors mt-2 ${
                pathname === "/"
                  ? "bg-primary text-white"
                  : "text-gray-300 hover:bg-gray-800"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <Home className="h-5 w-5 mr-3" />
              Main site
            </Link>
          </div>
        </nav>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}
