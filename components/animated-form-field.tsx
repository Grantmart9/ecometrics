"use client";

import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, X } from "lucide-react";

interface AnimatedFormFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  validation?: {
    isValid: boolean;
    message?: string;
  };
  list?: string;
  step?: string;
}

export default function AnimatedFormField({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  validation,
  list,
  step,
}: AnimatedFormFieldProps) {
  const hasValue = value.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="space-y-2"
    >
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Label
          htmlFor={id}
          className={`text-sm font-medium transition-colors ${
            validation?.isValid === false
              ? "text-red-600"
              : hasValue
                ? "text-emerald-600"
                : "text-gray-700"
          }`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>

        {validation && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center"
          >
            {validation.isValid ? (
              <Check className="h-4 w-4 text-emerald-500" />
            ) : (
              <X className="h-4 w-4 text-red-500" />
            )}
          </motion.div>
        )}
      </motion.div>

      <motion.div whileFocus={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          list={list}
          step={step}
          className={`transition-all duration-300 backdrop-blur-sm ${
            validation?.isValid === false
              ? "border-red-300 bg-red-50/50 focus:border-red-400"
              : hasValue
                ? "border-emerald-300 bg-emerald-50/50 focus:border-emerald-400"
                : "border-gray-300 bg-white/80 focus:border-emerald-400"
          }`}
        />
      </motion.div>

      {validation?.message && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="text-sm text-red-600"
        >
          {validation.message}
        </motion.p>
      )}
    </motion.div>
  );
}
