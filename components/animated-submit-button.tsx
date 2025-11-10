"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { ReactNode } from "react";

interface AnimatedSubmitButtonProps {
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
  success?: boolean;
  children: ReactNode;
  onClick?: () => void;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  className?: string;
}

export default function AnimatedSubmitButton({
  type = "submit",
  disabled = false,
  loading = false,
  success = false,
  children,
  onClick,
  variant = "default",
  className = "",
}: AnimatedSubmitButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: disabled || loading ? 1 : 1.05 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <Button
        type={type}
        disabled={disabled || loading}
        onClick={onClick}
        variant={variant}
        className={`
          relative overflow-hidden
          ${className}
          ${
            variant === "default"
              ? "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white shadow-lg"
              : ""
          }
        `}
      >
        <motion.div
          className="flex items-center gap-2"
          animate={{
            y: loading ? -2 : 0,
            opacity: loading ? 0.7 : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          {loading && (
            <motion.div
              initial={{ scale: 0, rotate: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Loader2 className="h-4 w-4 animate-spin" />
            </motion.div>
          )}

          {success && !loading && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
            >
              <Check className="h-4 w-4" />
            </motion.div>
          )}

          <span className={loading ? "animate-pulse" : ""}>
            {loading ? "Submitting..." : children}
          </span>
        </motion.div>

        {/* Success state background animation */}
        {success && !loading && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-emerald-500"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Hover effect */}
        {!disabled && !loading && (
          <motion.div
            className="absolute inset-0 bg-white/10"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        )}
      </Button>
    </motion.div>
  );
}
