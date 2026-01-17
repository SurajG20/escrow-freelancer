"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  index,
}: FeatureCardProps) {
  return (
    <motion.div
      className="rounded-4xl p-6 md:p-8 flex flex-col gap-3 md:gap-4 cursor-pointer border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.1,
        duration: 0.6,
        ease: "easeOut",
      }}
      whileHover={{
        scale: 1.05,
        y: -8,
      }}
      whileTap={{
        scale: 0.98,
      }}
    >
      <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-indigo-400/20 to-violet-500/20 flex items-center justify-center">
        <Icon className="w-6 h-6 md:w-8 md:h-8 text-indigo-400" />
      </div>
      <h3 className="text-lg md:text-xl font-thin text-white/90">{title}</h3>
      <p className="text-xs md:text-sm font-light text-white/60 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
