"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";

export function Loading() {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const tl = gsap.timeline();
    const progress = { value: 0 };
    
    tl.to(progress, {
      value: 100,
      duration: 3,
      onUpdate: function() {
        setPercentage(Math.round(progress.value));
      },
      onComplete: () => {
        gsap.to(".loading-screen", {
          opacity: 0,
          duration: 0.5,
          delay: 0.2,
          onComplete: () => {
            document.body.style.overflow = "auto";
          }
        });
      }
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="loading-screen fixed inset-0 bg-black z-50 flex items-center justify-center">
      <div className="text-white text-8xl font-light tracking-tighter">
        {percentage}%
      </div>
    </div>
  );
} 