"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user, signOut, isAdmin } = useAuth();

  console.log("Navbar: user", user);
  console.log("Navbar: isAdmin", isAdmin);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const baseNavLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Events", href: "/events" },
    { name: "Membership", href: "/membership" },
    { name: "Member List", href: "/member-list" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
    { name: "Donations", href: "/donations" },
    { name: "Campaigner", href: "/initiator" },
  ];

  const navLinks = user
    ? baseNavLinks.filter((link) => link.name !== "Membership")
    : baseNavLinks.filter((link) => link.name !== "Member List");

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-md py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container-custom">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex-shrink-0 flex items-center">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-primary font-bold text-xl md:text-2xl"
            >
              CMAHS ALUMNI ASSOCIATION
            </motion.span>
          </Link>
          <div className="hidden md:flex items-center space-x-1">
            <div className="flex space-x-1">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      pathname === link.href
                        ? "text-primary bg-primary-50 font-semibold"
                        : "text-gray-700 hover:text-primary hover:bg-primary-50/50"
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="ml-4">
              {user ? (
                <div className="flex items-center space-x-2">
                  {isAdmin && (
                    <Link href="/admin">
                      <Button variant="default" size="sm" className="shadow-sm">
                        Admin Panel
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => signOut()}
                    className="shadow-sm"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                >
                  <Link href="/login">
                    <Button variant="default" size="sm" className="shadow-sm">
                      Member Login
                    </Button>
                  </Link>
                </motion.div>
              )}
            </div>
          </div>
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden fixed inset-0 z-50 bg-white ${
          isOpen && scrolled ? "bg-white/90 backdrop-blur-md" : "bg-white"
        } transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={closeMenu}
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary focus:outline-none"
          >
            <span className="sr-only">Close menu</span>
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white">
          {navLinks.map((link, index) => (
            <motion.div
              key={link.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link
                href={link.href}
                className={`block px-3 py-4 rounded-md text-base font-medium ${
                  pathname === link.href
                    ? "text-primary bg-primary-50 font-semibold"
                    : "text-gray-700 hover:text-primary hover:bg-primary-50/50"
                }`}
                onClick={closeMenu}
              >
                {link.name}
              </Link>
            </motion.div>
          ))}
          {user ? (
            <div className="space-y-2 pt-4 px-3">
              {isAdmin && (
                <Link href="/admin" onClick={closeMenu}>
                  <Button variant="default" className="w-full">
                    Admin Panel
                  </Button>
                </Link>
              )}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  signOut();
                  closeMenu();
                }}
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="pt-4 px-3">
              <Link href="/login" onClick={closeMenu}>
                <Button variant="default" className="w-full">
                  Member Login
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
