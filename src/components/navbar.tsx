"use client";

import { useState } from "react";
import { cn } from "@/lib/utils"; // Optional: Utility function for class management
import Link from "next/link";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const {data: session} = useSession()

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo / Brand */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold colorGradText text-gray-800 dark:text-white">
              Pearon Blu
            </Link>
            {session?.username ? (<span className="pl-10 text-stone-500">Welcome {session.username}!</span>) : " "}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8  items-center">
            <a
              href="#about"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
            >
              About
            </a>
            <a
              href="#services"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
            >
              Services
            </a>
            <a
              href="#contact"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
            >
              Contact
            </a>
            <Link
              href="/signout"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
            >
              Sign out
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <Button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
            >
              <svg
                className={cn("h-6 w-6", { hidden: isOpen })}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
              <svg
                className={cn("h-6 w-6", { hidden: !isOpen })}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-4 pb-4">
            <a
              href="#home"
              className="block text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md px-2 py-2"
            >
              Home
            </a>
            <a
              href="#about"
              className="block text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md px-2 py-2"
            >
              About
            </a>
            <a
              href="#services"
              className="block text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md px-2 py-2"
            >
              Services
            </a>
            <a
              href="#contact"
              className="block text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md px-2 py-2"
            >
              Contact
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
