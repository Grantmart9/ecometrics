"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function ThreeBackground() {
  const [particles, setParticles] = useState<
    Array<{ left: string; top: string; delay: number }>
  >([]);

  useEffect(() => {
    // Generate particle positions only on client-side to avoid hydration mismatch
    const newParticles = Array.from({ length: 8 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: Math.random() * 4,
    }));
    setParticles(newParticles);
  }, []);

  if (particles.length === 0) {
    return null; // Don't render until particles are generated
  }
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Main gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-sky-50" />

      {/* Animated floating orbs */}
      <motion.div
        className="absolute top-20 left-20 w-32 h-32 rounded-full bg-gradient-to-br from-emerald-400/30 to-green-500/20 blur-xl"
        animate={{
          y: [-20, 20, -20],
          x: [-10, 10, -10],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute top-40 right-32 w-24 h-24 rounded-full bg-gradient-to-br from-green-400/40 to-emerald-500/30 blur-lg"
        animate={{
          y: [20, -15, 20],
          x: [15, -8, 15],
          scale: [1.2, 1, 1.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <motion.div
        className="absolute bottom-32 left-1/4 w-40 h-40 rounded-full bg-gradient-to-br from-emerald-300/25 to-green-400/20 blur-2xl"
        animate={{
          y: [-25, 15, -25],
          x: [-12, 8, -12],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />

      <motion.div
        className="absolute bottom-20 right-20 w-28 h-28 rounded-full bg-gradient-to-br from-green-500/35 to-emerald-400/25 blur-xl"
        animate={{
          y: [15, -20, 15],
          x: [-8, 12, -8],
          scale: [1.1, 1, 1.1],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />

      {/* Subtle grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      {/* Moving geometric shapes */}
      <motion.div
        className="absolute top-1/3 left-1/3 w-16 h-16 border border-emerald-300/20 rotate-45"
        animate={{
          rotate: [45, 225, 45],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <motion.div
        className="absolute bottom-1/3 right-1/3 w-12 h-12 border-2 border-green-400/30 rounded-full"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
      />

      {/* Light particles */}
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-emerald-400/60 rounded-full"
          style={{
            left: particle.left,
            top: particle.top,
          }}
          animate={{
            y: [-10, 10, -10],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 4 + Math.random() * 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  );
}
