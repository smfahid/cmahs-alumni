"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user, signOut, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const baseNavLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    // { name: "Events", href: "/events" },
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

  // Check if we're on homepage - only homepage should have transparent navbar at top
  const isHomePage = pathname === "/";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
        scrolled || !isHomePage
          ? "bg-white/80 backdrop-blur-2xl shadow-soft py-3"
          : "bg-transparent py-4 md:py-5"
      }`}
    >
      <div className="container-custom">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex-shrink-0 flex items-center group">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className={`font-semibold text-lg sm:text-xl md:text-2xl tracking-tight transition-colors ${
                scrolled || !isHomePage ? "text-foreground" : "text-white"
              } group-hover:text-primary`}
            >
              CMAHS ALUMNI
            </motion.span>
          </Link>
          <div className="hidden lg:flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Link
                    href={link.href}
                    className={`relative px-3 py-2 rounded-lg text-[15px] font-medium transition-all duration-200 ${
                      pathname === link.href
                        ? scrolled || !isHomePage
                          ? "text-primary bg-primary-50/80"
                          : "text-white bg-white/20"
                        : scrolled || !isHomePage
                        ? "text-foreground/80 hover:text-primary hover:bg-primary-50/50"
                        : "text-white/90 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="ml-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-200 p-0.5 focus:outline-none focus:ring-2 focus:ring-primary">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src="/placeholder-user.jpg" alt="User" />
                          <AvatarFallback className="bg-primary text-white text-sm font-medium">
                            U
                          </AvatarFallback>
                        </Avatar>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-56 rounded-xl shadow-xl border-border/50"
                    >
                      <DropdownMenuLabel className="text-[15px]">
                        My Account
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link
                          href="/profile"
                          className="text-[15px] cursor-pointer"
                        >
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href="/settings"
                          className="text-[15px] cursor-pointer"
                        >
                          Settings
                        </Link>
                      </DropdownMenuItem>
                      {isAdmin && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link
                              href="/admin"
                              className="text-primary font-medium text-[15px] cursor-pointer"
                            >
                              Admin Dashboard
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => signOut()}
                        className="text-destructive text-[15px] cursor-pointer"
                      >
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Link href="/login">
                    <Button
                      variant="default"
                      size="sm"
                      className={`rounded-xl shadow-sm text-[15px] h-9 px-5 transition-all duration-200 ${
                        scrolled || !isHomePage
                          ? "bg-primary hover:bg-primary-600"
                          : "bg-white text-primary hover:bg-white/90"
                      }`}
                    >
                      Sign In
                    </Button>
                  </Link>
                </motion.div>
              )}
            </div>
          </div>
          <div className="flex lg:hidden items-center">
            <button
              onClick={toggleMenu}
              className={`inline-flex items-center justify-center p-2.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary ${
                scrolled || !isHomePage
                  ? "text-foreground hover:bg-primary-50"
                  : "text-white hover:bg-white/10"
              }`}
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
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={closeMenu}
            />

            {/* Menu panel */}
            <motion.div
              initial={{ opacity: 0, x: "100%" }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: "100%" }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                opacity: { duration: 0.2 },
              }}
              className="lg:hidden fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-gradient-to-b from-white to-primary-50/30 shadow-2xl"
            >
              {/* Header with close button */}
              <div className="flex justify-between items-center p-4 border-b border-border/50 bg-white/80 backdrop-blur-xl">
                <span className="font-semibold text-lg tracking-tight text-foreground">
                  Menu
                </span>
                <button
                  onClick={closeMenu}
                  className="inline-flex items-center justify-center p-2 rounded-lg text-foreground hover:bg-primary-50 active:scale-95 transition-all duration-200 focus:outline-none"
                >
                  <span className="sr-only">Close menu</span>
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Menu content */}
              <div className="bg-slate-100 px-4 pt-4 pb-6 space-y-1.5 overflow-y-auto max-h-[calc(100vh-80px)]">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.05,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <Link
                      href={link.href}
                      className={`block px-4 py-3 rounded-lg text-[15px] font-medium transition-all duration-200 ${
                        pathname === link.href
                          ? "text-white bg-primary shadow-sm"
                          : "text-foreground bg-white hover:text-primary hover:bg-primary-50 active:scale-[0.98] shadow-sm border border-border/50"
                      }`}
                      onClick={closeMenu}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                {user ? (
                  <>
                    {isAdmin && (
                      <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: navLinks.length * 0.05 + 0.1,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      >
                        <Link href="/admin" onClick={closeMenu}>
                          <div className="px-4 py-3 rounded-lg text-[15px] font-medium transition-all duration-200 text-white bg-primary shadow-sm">
                            Admin Dashboard
                          </div>
                        </Link>
                      </motion.div>
                    )}
                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        delay:
                          (navLinks.length + (isAdmin ? 1 : 0)) * 0.05 + 0.1,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <Link href="/profile" onClick={closeMenu}>
                        <div className="block px-4 py-3 rounded-lg text-[15px] font-medium transition-all duration-200 text-foreground bg-white hover:text-primary hover:bg-primary-50 active:scale-[0.98] shadow-sm border border-border/50">
                          <div className="flex items-center">My Profile</div>
                        </div>
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        delay:
                          (navLinks.length + (isAdmin ? 2 : 1)) * 0.05 + 0.1,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <Link href="/settings" onClick={closeMenu}>
                        <div className="block px-4 py-3 rounded-lg text-[15px] font-medium transition-all duration-200 text-foreground bg-white hover:text-primary hover:bg-primary-50 active:scale-[0.98] shadow-sm border border-border/50">
                          Settings
                        </div>
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        delay:
                          (navLinks.length + (isAdmin ? 3 : 2)) * 0.05 + 0.1,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <div
                        className="block px-4 py-3 rounded-lg text-[15px] font-medium transition-all duration-200 text-destructive hover:bg-destructive/10 hover:text-destructive bg-white active:scale-[0.98] shadow-sm border border-border/50 cursor-pointer"
                        onClick={async () => {
                          await signOut();
                          closeMenu();
                        }}
                      >
                        Logout
                      </div>
                    </motion.div>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: navLinks.length * 0.05 + 0.1,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <Link href="/login" onClick={closeMenu}>
                      <div className="block px-4 py-3 rounded-lg text-[15px] font-medium transition-all duration-200 text-white bg-primary shadow-sm">
                        Sign In
                      </div>
                    </Link>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
