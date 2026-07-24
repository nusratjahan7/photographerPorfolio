"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  {
    name: "About",
    href: "/about",
  },
  {
    name: "Services",
    href: "/services",
  },
  {
    name: "Pricing",
    href: "/pricing",
  },
  {
    name: "Blog",
    href: "/blog",
  },
];


export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-6">

      <div className="max-w-7xl mx-auto flex items-center justify-between">


        {/* Logo */}
        <Link href="/">
          <div className="flex items-center justify-center w-12 h-12 bg-white/50 rounded-full cursor-pointer">
            <svg
              className="w-6 h-6 text-black"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
        </Link>


        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-2">

          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="px-5 py-2 bg-white/15 backdrop-blur-md text-white rounded-full font-medium hover:bg-white/25 transition"
            >
              {link.name}
            </Link>
          ))}

        </div>


        {/* Mobile Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden flex items-center justify-center w-10 h-10 bg-black/20 backdrop-blur-md rounded-full"
        >
          <svg
            className="w-5 h-5 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>


        {/* Mobile Menu */}
        <AnimatePresence mode="wait">

          {isMenuOpen && (

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-20 left-6 right-6 md:hidden"
            >

              <div
                className="bg-black/40 backdrop-blur-xl rounded-3xl p-6 space-y-3"
              >

                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 text-white rounded-2xl hover:bg-white/20 transition"
                  >
                    {link.name}
                  </Link>
                ))}

              </div>

            </motion.div>

          )}

        </AnimatePresence>


      </div>

    </nav>
  );
}