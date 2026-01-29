"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useEntityRelationship } from "@/lib/entityRelationshipContext";
import { Leaf, ChevronDown, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { crudService } from "@/lib/crudService";

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

// Navigation items for authenticated users
const authenticatedNavItems = [
  { href: "/", label: "Home" },
];

export function Nav() {
  const pathname = usePathname();
  const { isAuthenticated, user, logout, session } = useAuth();
  const { selectedEntityRelationship, setSelectedEntityRelationship } = useEntityRelationship();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [companies, setCompanies] = useState<{ id: string; name: string; entityId: string }[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>("");
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);
  const [hasVisitedInputPage, setHasVisitedInputPage] = useState(false);

  // Track when user visits Input Data page
  useEffect(() => {
    console.log("🔍 Tracking Input Data page visit:", { pathname, isAuthenticated, hasVisitedInputPage });
    if ((pathname === "/input" || pathname === "/input/") && isAuthenticated && !hasVisitedInputPage) {
      console.log("✅ Setting hasVisitedInputPage to true");
      setHasVisitedInputPage(true);
    }
  }, [pathname, isAuthenticated, hasVisitedInputPage]);

  // Fetch companies from CRUD API only after visiting Input Data page
  useEffect(() => {
    const fetchCompanies = async () => {
      console.log("🔍 Fetch companies called:", { hasVisitedInputPage, hasToken: !!session?.access_token });
      if (!session?.access_token || !hasVisitedInputPage) {
        console.log("⏭️ Skipping fetch - conditions not met");
        return;
      }

      setIsLoadingCompanies(true);
      try {
        console.log("📡 Sending CRUD request for companies...");
        const response = await crudService.callCrud({
          data: JSON.stringify([{
            RecordSet: "Company",
            TableName: "entityrelationship",
            Action: "readExact",
            Fields: {
              Entity: "4",
              Relationship: "58287"
            }
          }]),
          PageNo: "1",
          NoOfLines: "300",
          CrudMessage: "@CrudMessage"
        });

        console.log("📥 CRUD response:", response);

        if (response?.Data && response.Data[0]?.JsonData) {
          const jsonData = JSON.parse(response.Data[0].JsonData);
          const tableData = jsonData.Company?.TableData || [];
          
          console.log("📊 Table data:", tableData);
          console.log("📊 Table data length:", tableData.length);
          
          // Extract unique companies with their IDs
          const companiesMap = new Map<string, { id: string; name: string; entityId: string }>();
          
          tableData.forEach((item: any, index: number) => {
            console.log(`📊 Processing item ${index}:`, item);
            const name = item.entityrelationshipEntityBName;
            const entityId = item.entityrelationshipEntityB;
            
            console.log(`📊 Item ${index} - Name: ${name}, ID: ${entityId}, Type of ID: ${typeof entityId}`);
            
            if (typeof name === "string" && name.trim() !== "" && (typeof entityId === "string" || typeof entityId === "number")) {
              if (!companiesMap.has(name)) {
                companiesMap.set(name, {
                  id: `company-${entityId}`,
                  name: name,
                  entityId: String(entityId)
                });
              }
            }
          });
          
          const uniqueCompanies = Array.from(companiesMap.values());

          console.log("✅ Setting companies:", uniqueCompanies);
          console.log("✅ Companies count:", uniqueCompanies.length);
          setCompanies(uniqueCompanies);
          
          // Set default company if available
          if (uniqueCompanies.length > 0) {
            setSelectedCompanyId(uniqueCompanies[0].id);
            localStorage.setItem("selectedCompanyId", uniqueCompanies[0].id);
            // Set default entity relationship in context
            setSelectedEntityRelationship(uniqueCompanies[0].name, uniqueCompanies[0].entityId);
          }
        }
      } catch (error) {
        console.error("❌ Error fetching companies:", error);
      } finally {
        setIsLoadingCompanies(false);
      }
    };

    fetchCompanies();
  }, [session?.access_token, hasVisitedInputPage]);

  // Load selected company from localStorage on mount
  useEffect(() => {
    const savedCompanyId = localStorage.getItem("selectedCompanyId");
    if (savedCompanyId) {
      setSelectedCompanyId(savedCompanyId);
    }
  }, []);

  // Handle company selection
  const handleCompanyChange = (companyId: string) => {
    setSelectedCompanyId(companyId);
    localStorage.setItem("selectedCompanyId", companyId);
    
    // Update entity relationship context with the selected company name and ID
    const selectedCompany = companies.find(c => c.id === companyId);
    if (selectedCompany) {
      setSelectedEntityRelationship(selectedCompany.name, selectedCompany.entityId);
    }
  };

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
            {/* Authenticated user navigation */}
            {isAuthenticated ? (
              <>
                {/* Home link */}
                <Link
                  href="/"
                  className={cn(
                    "text-sm font-medium transition-colors",
                    pathname === "/"
                      ? "text-green-700"
                      : "text-gray-700 hover:text-green-600"
                  )}
                >
                  Home
                </Link>

                {/* Calculate Dropdown */}
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
            ) : (
              <>
                {/* Non-authenticated user navigation */}
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
              </>
            )}
          </div>

          {/* Auth Section */}
          {isAuthenticated && user ? (
            <div className="flex items-center space-x-4">
              {/* Company Dropdown - Only show after visiting Input Data page */}
              {hasVisitedInputPage && (
                <>
                  {console.log("🎨 Rendering company dropdown:", { hasVisitedInputPage, companiesCount: companies.length })}
                  <Select
                    value={selectedCompanyId}
                    onValueChange={handleCompanyChange}
                    disabled={isLoadingCompanies || companies.length === 0}
                  >
                    <SelectTrigger className="w-[200px] h-9 text-sm border-green-200 focus:ring-green-500">
                      <SelectValue placeholder={isLoadingCompanies ? "Loading..." : "Select entity relationship"} />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </>
              )}

              <span className="text-sm font-medium text-gray-700">
                {user?.username || user?.name}
              </span>
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
