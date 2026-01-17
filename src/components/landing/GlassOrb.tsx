"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function GlassOrb() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <motion.div
      className="relative w-[300px] h-[300px] md:w-[600px] md:h-[600px] mx-auto"
      animate={{
        y: [0, -4, 0],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="w-full h-full rounded-full relative overflow-hidden border-2 border-slate-200 bg-gradient-to-br from-indigo-50 to-violet-50 shadow-lg"
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
          scale: isHovered ? 1.01 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 50,
          damping: 20,
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="text-4xl md:text-8xl font-thin text-white/90"
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            $
          </motion.div>
        </div>

        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-indigo-400/40"
              style={{
                left: `${20 + i * 10}%`,
                top: `${30 + Math.sin(i) * 20}%`,
              }}
              animate={{
                scale: [0.5, 1, 0.5],
                opacity: [0.3, 0.8, 0.3],
                x: [
                  0,
                  Math.cos((i * Math.PI) / 4) * 50,
                  Math.cos((i * Math.PI) / 4) * 50,
                  0,
                ],
                y: [
                  0,
                  Math.sin((i * Math.PI) / 4) * 50,
                  Math.sin((i * Math.PI) / 4) * 50,
                  0,
                ],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-transparent to-violet-500/20 pointer-events-none" />
      </motion.div>
    </motion.div>
  );
}
