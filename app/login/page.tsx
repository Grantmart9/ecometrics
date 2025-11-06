"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Leaf, ArrowLeft, Mail, Lock, User, Building } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    company: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isLogin) {
        // Login
        const { error: loginError } = await login(
          formData.email,
          formData.password
        );
        if (loginError) {
          // Provide user-friendly message for email confirmation
          if (
            loginError.includes("Email not confirmed") ||
            loginError.includes("email_not_confirmed")
          ) {
            setError(
              "Please check your email and click the confirmation link before logging in."
            );
          } else {
            setError(loginError);
          }
          setIsLoading(false);
          return;
        }
        router.push("/");
      } else {
        // Register
        const { error: registerError } = await register(
          formData.email,
          formData.password,
          formData.name,
          formData.company
        );
        if (registerError) {
          setError(registerError);
          setIsLoading(false);
          return;
        }
        setError(null);
        alert(
          "Registration successful! Please check your email to confirm your account."
        );
        setIsLogin(true); // Switch to login mode after successful registration
      }

      setIsLoading(false);
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-sky-50">
      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full space-y-8"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Leaf className="h-10 w-10 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-900">
              {isLogin ? "Welcome back" : "Create your account"}
            </h2>
            <p className="mt-2 text-gray-600">
              {isLogin
                ? "Sign in to access your sustainability dashboard"
                : "Join EcoMetrics and start measuring your impact"}
            </p>
            {!isLogin && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Note:</strong> You'll need to confirm your email
                  address before you can log in. Check your inbox for a
                  confirmation link after registration.
                </p>
              </div>
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-green-100"
          >
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                  {error}
                </div>
              )}

              {!isLogin && (
                <div>
                  <label htmlFor="name" className="sr-only">
                    Full name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required={!isLogin}
                      className="pl-10"
                      placeholder="Full name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    name="email"
                    type="text"
                    autoComplete="email"
                    required
                    className="pl-10"
                    placeholder="Email address (or username)"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label htmlFor="company" className="sr-only">
                    Company name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className="h-5 w-5 text-gray-400" />
                    </div>
                    <Input
                      id="company"
                      name="company"
                      type="text"
                      className="pl-10"
                      placeholder="Company name (optional)"
                      value={formData.company}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="pl-10"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div>
                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg font-medium transition-colors"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      {isLogin ? "Signing in..." : "Creating account..."}
                    </div>
                  ) : isLogin ? (
                    "Sign in"
                  ) : (
                    "Create account"
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    {isLogin
                      ? "New to EcoMetrics?"
                      : "Already have an account?"}
                  </span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-green-600 hover:text-green-700 font-medium transition-colors"
                >
                  {isLogin
                    ? "Create a new account"
                    : "Sign in to existing account"}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  By creating an account, you agree to our{" "}
                  <a href="#" className="text-green-600 hover:text-green-700">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-green-600 hover:text-green-700">
                    Privacy Policy
                  </a>
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center py-4">
            <Link
              href="/"
              className="flex items-center px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
