"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DeviceFrameProps {
  children: React.ReactNode;
  className?: string;
  variant?: "phone" | "panel" | "chat";
}

/**
 * Device frame wrapper for scene panels.
 * "phone" — mobile app with status bar
 * "panel" — wider card for tools/dashboards
 * "chat"  — warm conversational enclosure
 */
export function DeviceFrame({ children, className, variant = "phone" }: DeviceFrameProps) {
  return (
    <motion.div
      className={cn(
        "overflow-hidden shadow-2xl shadow-black/40",
        variant === "phone" && "w-[280px] rounded-[20px] border border-white/[0.06] bg-[#0c0c0f]",
        variant === "panel" && "w-[320px] rounded-xl border border-white/[0.06] bg-[#0c0c0f]",
        variant === "chat" && "w-[280px] rounded-[20px] border border-amber-900/20 bg-[#0f0d0a]",
        className
      )}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Status bar */}
      {(variant === "phone" || variant === "chat") && (
        <div className="flex justify-between items-center px-5 py-1.5">
          <span className="text-[9px] text-white/25 font-medium tracking-wide">9:41</span>
          <div className="flex items-center gap-1">
            <div className="flex gap-[2px]">
              {[0.9, 0.7, 0.5, 0.3].map((h, i) => (
                <div
                  key={i}
                  className="w-[3px] rounded-[0.5px] bg-white/20"
                  style={{ height: `${6 + h * 4}px` }}
                />
              ))}
            </div>
            <div className="w-4 h-[7px] rounded-[1px] border border-white/20 ml-1 relative">
              <div className="absolute inset-[1px] right-[2px] bg-white/25 rounded-[0.5px]" />
            </div>
          </div>
        </div>
      )}

      {/* Panel header bar */}
      {variant === "panel" && (
        <div className="flex items-center gap-2 px-4 py-2 border-b border-white/[0.04]">
          <div className="flex gap-1">
            <div className="w-[6px] h-[6px] rounded-full bg-white/10" />
            <div className="w-[6px] h-[6px] rounded-full bg-white/10" />
            <div className="w-[6px] h-[6px] rounded-full bg-white/10" />
          </div>
        </div>
      )}

      {children}
    </motion.div>
  );
}
