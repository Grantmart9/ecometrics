"use client";

import { useMemo } from "react";
import Lottie from "lottie-react";
import homepageAnimation from "@/public/homepage1.json";

// Minimal wrapper, no background or glow
const CarbonAnimation = () => {
  const options = useMemo(
    () => ({
      loop: true,
      autoplay: true,
      animationData: homepageAnimation as any,
    }),
    []
  );

  return (
    <div className="relative w-80 h-80">
      <Lottie
        {...options}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
};

export default CarbonAnimation;
