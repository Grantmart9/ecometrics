"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Leaf, ChevronDown, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const carboncalcNavItems = [{ href: "/input", label: "Upload Data" }];

const ecometricsNavItems = [
  { href: "/real-time-carbon-tracking", label: "Carbon Emissions Tracking" },
  { href: "/automated-reports", label: "Automated Reports" },
  { href: "/custom-dashboards", label: "Custom Dashboards" },
  { href: "/emission-source-breakdown", label: "Emission Breakdown" },
  { href: "/cloud-integration", label: "Cloud Integration" },
  { href: "/team-collaboration", label: "Team Collaboration" },
];

const accountNavItems = [
  { href: "/settings", label: "Settings" },
  { href: "/help", label: "Help" },
];

const mainNavItems = [
  { href: "#about", label: "About" },
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#testimonials", label: "Testimonials" },
];

export function Nav() {
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Debug logging for routing
  console.log("Nav component - pathname:", pathname);
  console.log("Nav component - isAuthenticated:", isAuthenticated);

  const handleLogout = () => {
    logout();
  };

  const isLandingPage = pathname === "/";
  const isInternalPage = !isLandingPage && isAuthenticated;

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-green-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center">
            <Leaf className="h-8 w-8 text-green-600 mr-2" />
            <span className="text-2xl font-bold text-gray-900">EcoMetrics</span>
          </Link>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Landing page main navigation */}
            {isLandingPage && (
              <>
                {mainNavItems.map((item) => (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    className="text-gray-700 hover:text-green-600 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item.label}
                  </motion.a>
                ))}

                {/* Calculate Dropdown for landing page - only show when authenticated */}
                {isAuthenticated && (
                  <div className="relative">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-green-700 hover:bg-green-50 transition-colors"
                    >
                      Calculate
                      <motion.div
                        animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {isDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full mt-2 bg-white/95 backdrop-blur-md border border-green-200 rounded-xl shadow-xl z-50 min-w-[280px] max-h-[500px] overflow-y-auto"
                        >
                          <div className="p-2">
                            {/* CarbonCalc Items */}
                            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                              Data
                            </div>
                            {carboncalcNavItems.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                  "flex items-center px-3 py-2 text-sm transition-colors rounded-md",
                                  pathname === item.href
                                    ? "bg-green-100 text-green-700 font-medium"
                                    : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                                )}
                                onClick={() => setIsDropdownOpen(false)}
                              >
                                {item.label}
                              </Link>
                            ))}

                            {/* EcoMetrics Items */}
                            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-2 border-t border-green-100 pt-2">
                              Reporting & Analytics
                            </div>
                            {ecometricsNavItems.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                  "flex items-center px-3 py-2 text-sm transition-colors rounded-md",
                                  pathname === item.href
                                    ? "bg-green-100 text-green-700 font-medium"
                                    : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                                )}
                                onClick={() => setIsDropdownOpen(false)}
                              >
                                {item.label}
                              </Link>
                            ))}

                            {/* Account Items */}
                            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-2 border-t border-green-100 pt-2">
                              Account
                            </div>
                            {accountNavItems.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                  "flex items-center px-3 py-2 text-sm transition-colors rounded-md",
                                  pathname === item.href
                                    ? "bg-green-100 text-green-700 font-medium"
                                    : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                                )}
                                onClick={() => setIsDropdownOpen(false)}
                              >
                                {item.label}
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </>
            )}

            {/* Internal page navigation - only Home and Calculate */}
            {isInternalPage && (
              <>
                <Link
                  href="/"
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    pathname === "/"
                      ? "text-green-700"
                      : "text-gray-700 hover:text-green-700"
                  )}
                >
                  Home
                </Link>

                {/* Calculate Dropdown for internal pages */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-green-700 hover:bg-green-50 transition-colors"
                  >
                    Calculate
                    <motion.div
                      animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full mt-2 bg-white/95 backdrop-blur-md border border-green-200 rounded-xl shadow-xl z-50 min-w-[280px] max-h-[500px] overflow-y-auto"
                      >
                        <div className="p-2">
                          {/* CarbonCalc Items */}
                          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Data
                          </div>
                          {carboncalcNavItems.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={cn(
                                "flex items-center px-3 py-2 text-sm transition-colors rounded-md",
                                pathname === item.href
                                  ? "bg-green-100 text-green-700 font-medium"
                                  : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                              )}
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              {item.label}
                            </Link>
                          ))}

                          {/* EcoMetrics Items */}
                          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-2 border-t border-green-100 pt-2">
                            Reporting & Analytics
                          </div>
                          {ecometricsNavItems.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={cn(
                                "flex items-center px-3 py-2 text-sm transition-colors rounded-md",
                                pathname === item.href
                                  ? "bg-green-100 text-green-700 font-medium"
                                  : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                              )}
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              {item.label}
                            </Link>
                          ))}

                          {/* Account Items */}
                          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-2 border-t border-green-100 pt-2">
                            Account
                          </div>
                          {accountNavItems.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={cn(
                                "flex items-center px-3 py-2 text-sm transition-colors rounded-md",
                                pathname === item.href
                                  ? "bg-green-100 text-green-700 font-medium"
                                  : "text-gray-700 hover:bg-green-50 hover:text-green-700"
                              )}
                              onClick={() => setIsDropdownOpen(false)}
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>

          {/* Auth Section */}
          {isAuthenticated && user ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-gray-700">
                <User className="h-5 w-5 mr-2 text-green-600" />
                <span className="font-medium">{user?.name}</span>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="text-gray-700 border-green-200 hover:bg-green-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                href="/login"
                className="text-gray-700 hover:text-green-600 transition-colors"
              >
                Login
              </Link>
              <Link href="/login">
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
