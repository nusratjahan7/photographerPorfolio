"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, LogOut, Menu, X, ChevronDown } from "lucide-react";
import { authClient } from "@/lib/auth-client";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Gallery", href: "/gallery" },
  { name: "Services", href: "/services" },
  { name: "Pricing", href: "/pricing" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef(null);

  // Get session data from authClient
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const showAuthSkeleton = !mounted || isPending;

  // Close dropdown on click outside
  useEffect(() => {
    setMounted(true);

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setIsDropdownOpen(false);
          setIsMenuOpen(false);
          router.push("/auth/login");
        },
      },
    });
  };

  // Get first letter of user name or email capitalized
  const userInitial = user?.name
    ? user.name.charAt(0).toUpperCase()
    : user?.email
      ? user.email.charAt(0).toUpperCase()
      : "U";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex items-center justify-center w-11 h-11 bg-white/10 border border-white/20 backdrop-blur-xl rounded-2xl group-hover:bg-red-600 transition-all duration-300">
            <svg
              className="w-5 h-5 text-white transition-transform group-hover:scale-110"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1.5 p-1.5 bg-neutral-900/60 border border-white/10 backdrop-blur-2xl rounded-full shadow-lg shadow-black/40">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="px-5 py-2 text-sm text-neutral-300 hover:text-white rounded-full font-medium transition duration-200 hover:bg-white/10"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Auth Buttons / User Menu */}
        <div className="hidden md:flex items-center gap-3">
          {showAuthSkeleton ? (
            <div className="w-10 h-10 rounded-full bg-neutral-800 animate-pulse border border-white/10" />
          ) : user ? (
            /* User Avatar & Dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 p-1 pl-3 bg-neutral-900/60 border border-white/10 backdrop-blur-xl rounded-full hover:border-red-500/50 transition focus:outline-none"
              >
                <span className="text-xs font-semibold text-neutral-300 max-w-[100px] truncate">
                  {user.name || user.email}
                </span>
                <div className="flex items-center justify-center w-9 h-9 bg-red-600 text-white font-bold text-sm rounded-full shadow-md shadow-red-600/30">
                  {userInitial}
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-neutral-400 mr-2 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-52 rounded-2xl border border-white/10 bg-neutral-900/90 p-2 backdrop-blur-2xl shadow-2xl shadow-black/80 z-50 space-y-1"
                  >
                    <div className="px-3 py-2 border-b border-white/10 mb-1">
                      <p className="text-xs text-neutral-400">Signed in as</p>
                      <p className="text-sm font-medium text-white truncate">
                        {user.email}
                      </p>
                    </div>

                    {/* Role-based Dashboard Link */}
                    {user.role === "admin" && (
                      <Link
                        href="/dashboard/admin"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-neutral-200 rounded-xl hover:bg-white/10 transition"
                      >
                        <LayoutDashboard className="w-4 h-4 text-red-500" />
                        <span>Dashboard</span>
                      </Link>
                    )}

                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-400 hover:text-red-300 rounded-xl hover:bg-red-500/10 transition text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            /* Logged Out Buttons */
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="px-5 py-2 text-sm font-medium text-white hover:text-red-400 transition"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="px-5 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-500 rounded-full transition duration-200 shadow-lg shadow-red-600/20 active:scale-95"
              >
                Register
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden flex items-center justify-center w-10 h-10 bg-neutral-900/80 border border-white/10 backdrop-blur-md rounded-full text-white"
        >
          {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute top-20 left-6 right-6 md:hidden z-50"
          >
            <div className="bg-neutral-900/90 border border-white/10 backdrop-blur-2xl rounded-3xl p-6 space-y-4 shadow-2xl shadow-black/80">
              {/* Navigation Links */}
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 text-sm font-medium text-neutral-300 hover:text-white rounded-2xl hover:bg-white/10 transition"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="pt-4 border-t border-white/10">
                {showAuthSkeleton ? (
                  <div className="w-full h-10 rounded-2xl bg-white/10 animate-pulse" />
                ) : user ? (
                  <div className="space-y-3">
                    {/* User info header on mobile */}
                    <div className="flex items-center gap-3 px-2">
                      <div className="flex items-center justify-center w-10 h-10 bg-red-600 text-white font-bold text-base rounded-full">
                        {userInitial}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-sm font-semibold text-white truncate">
                          {user.name || "User"}
                        </p>
                        <p className="text-xs text-neutral-400 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    {/* Admin Dashboard on mobile */}
                    {user.role === "admin" && (
                      <Link
                        href="/dashboard/admin"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-2.5 w-full px-4 py-3 text-sm text-neutral-200 rounded-2xl bg-white/5 hover:bg-white/10 transition"
                      >
                        <LayoutDashboard className="w-4 h-4 text-red-500" />
                        <span>Dashboard</span>
                      </Link>
                    )}

                    {/* Mobile Logout */}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 w-full px-4 py-3 text-sm text-red-400 rounded-2xl bg-red-500/10 hover:bg-red-500/20 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                ) : (
                  /* Mobile Auth Links */
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/auth/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full py-3 text-center text-sm font-medium text-white bg-white/10 rounded-2xl hover:bg-white/15 transition"
                    >
                      Login
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full py-3 text-center text-sm font-semibold text-white bg-red-600 rounded-2xl hover:bg-red-500 transition shadow-lg shadow-red-600/20"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}