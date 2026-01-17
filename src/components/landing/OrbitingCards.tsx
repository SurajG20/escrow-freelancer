"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { CheckCircle2, Lock, FileText, AlertCircle } from "lucide-react";

const milestones = [
  { id: 1, label: "Funded", icon: Lock, color: "text-indigo-400", delay: 0 },
  {
    id: 2,
    label: "Submitted",
    icon: FileText,
    color: "text-blue-400",
    delay: 15,
  },
  {
    id: 3,
    label: "Released ✓",
    icon: CheckCircle2,
    color: "text-emerald-400",
    delay: 30,
  },
  {
    id: 4,
    label: "Resolved",
    icon: AlertCircle,
    color: "text-amber-400",
    delay: 45,
  },
];

export function OrbitingCards() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [radius, setRadius] = useState(300);

  useEffect(() => {
    const updateRadius = () => {
      setRadius(window.innerWidth < 768 ? 150 : 300);
    };
    updateRadius();
    window.addEventListener("resize", updateRadius);
    return () => window.removeEventListener("resize", updateRadius);
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {milestones.map((milestone, index) => {
        const baseAngle = (index * 360) / milestones.length;

        return (
          <motion.div
            key={milestone.id}
            className="absolute w-[90px] h-[90px] md:w-[120px] md:h-[120px] rounded-2xl flex flex-col items-center justify-center gap-1 md:gap-2 pointer-events-auto cursor-pointer border border-slate-200 bg-white shadow-sm"
            initial={{
              x: Math.cos((baseAngle * Math.PI) / 180) * radius,
              y: Math.sin((baseAngle * Math.PI) / 180) * radius,
            }}
            animate={{
              x: [
                Math.cos((baseAngle * Math.PI) / 180) * radius,
                Math.cos(((baseAngle + 360) * Math.PI) / 180) * radius,
              ],
              y: [
                Math.sin((baseAngle * Math.PI) / 180) * radius,
                Math.sin(((baseAngle + 360) * Math.PI) / 180) * radius,
              ],
            }}
            transition={{
              duration: 60,
              repeat: Infinity,
              ease: "linear",
              delay: milestone.delay,
            }}
            onMouseEnter={() => setHoveredCard(milestone.id)}
            onMouseLeave={() => setHoveredCard(null)}
            whileHover={{
              scale: 1.15,
              zIndex: 10,
            }}
          >
            <milestone.icon
              className={`w-5 h-5 md:w-8 md:h-8 ${milestone.color} ${
                hoveredCard === milestone.id ? "scale-125" : ""
              } transition-transform`}
            />
            <span className="text-[10px] md:text-xs font-light text-white/80 text-center px-1">
              {milestone.label}
            </span>
            {milestone.id === 3 && hoveredCard === 3 && (
              <motion.div
                className="absolute inset-0 rounded-2xl"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                }}
                style={{
                  boxShadow: "0 0 30px hsl(142 76% 36% / 0.6)",
                }}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
