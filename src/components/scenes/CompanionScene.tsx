"use client";

import { motion } from "framer-motion";
import { DeviceFrame } from "./DeviceFrame";

interface CompanionSceneProps {
  encounterId: string;
}

/* ══════════════════════════════════════════════════════════
 * ZONE 2 — THE COMPANION
 * Visual language: intimate conversational enclosures,
 * warm but frictionless, memory panels, co-authored text
 * ══════════════════════════════════════════════════════════ */

export function CompanionScene({ encounterId }: CompanionSceneProps) {
  switch (encounterId) {
    case "z2-reply":
      return <ReplyScene />;
    case "z2-dinner":
      return <DinnerScene />;
    case "z2-route":
      return <RouteScene />;
    default:
      return null;
  }
}

// ─── z2-reply: Smart Reply with Memory Recap ────────────

function ReplyScene() {
  const suggestions = [
    "Good! Really busy lately but can't complain 😊",
    "All good here! How about you?",
    "Thanks for checking in! Miss you ❤️",
  ];

  return (
    <DeviceFrame variant="chat">
      <div className="px-3 pt-1 pb-3">
        {/* Contact header */}
        <motion.div
          className="flex items-center gap-2.5 pb-2 mb-2 border-b border-white/[0.04]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-[10px] text-white/25">←</div>
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-amber-800/40 to-orange-900/60 flex items-center justify-center">
            <span className="text-[9px] text-amber-200/60">A</span>
          </div>
          <div>
            <p className="text-[11px] text-white/70 font-medium">Alex</p>
            <p className="text-[8px] text-white/20">last active 3h ago</p>
          </div>
        </motion.div>

        {/* Memory recap panel — the AI remembers your relationship */}
        <motion.div
          className="px-2.5 py-2 rounded-lg bg-amber-950/15 border border-amber-900/10 mb-3"
          initial={{ opacity: 0, y: -3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-3 h-3 rounded-full bg-amber-800/25 flex items-center justify-center">
              <span className="text-[6px] text-amber-300/50">✦</span>
            </div>
            <span className="text-[7px] text-amber-300/35 uppercase tracking-wider">Memory</span>
          </div>
          <p className="text-[8px] text-amber-200/30 leading-relaxed">
            You and Alex last spoke 4 months ago. You mentioned work was overwhelming. Alex sent a playlist you never listened to.
          </p>
        </motion.div>

        {/* Message thread */}
        <div className="min-h-[40px] flex flex-col justify-end mb-3">
          {/* Friend's message */}
          <motion.div
            className="self-start max-w-[85%]"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-white/[0.06] rounded-2xl rounded-bl-md px-3 py-2">
              <p className="text-[11px] text-white/70 leading-relaxed">
                Hey, been thinking about you. How&apos;s everything going?
              </p>
            </div>
            <p className="text-[8px] text-white/15 mt-0.5 ml-1">2:34 PM</p>
          </motion.div>
        </div>

        {/* Smart reply divider */}
        <motion.div
          className="flex items-center gap-2 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <div className="flex-1 h-[0.5px] bg-white/[0.04]" />
          <span className="text-[7px] text-white/15 uppercase tracking-wider">Smart Reply</span>
          <div className="flex-1 h-[0.5px] bg-white/[0.04]" />
        </motion.div>

        {/* Suggestion bubbles */}
        <div className="space-y-1.5 mb-3">
          {suggestions.map((text, i) => (
            <motion.div
              key={i}
              className="px-3 py-2 rounded-xl border border-amber-800/15 bg-amber-950/20 cursor-default"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 + i * 0.12 }}
            >
              <p className="text-[10px] text-amber-200/50 leading-relaxed">{text}</p>
            </motion.div>
          ))}
        </div>

        {/* Input area */}
        <motion.div
          className="flex items-center gap-2 p-2 rounded-full bg-white/[0.03] border border-white/[0.04]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <div className="flex-1">
            <span className="text-[10px] text-white/15 italic">Type a message...</span>
          </div>
          <div className="w-5 h-5 rounded-full bg-white/[0.04] flex items-center justify-center">
            <span className="text-[9px] text-white/15">→</span>
          </div>
        </motion.div>
      </div>
    </DeviceFrame>
  );
}

// ─── z2-dinner: Recipe Assistant with Co-Authorship ─────

function DinnerScene() {
  const ingredients = ["Salmon", "Miso", "Ginger", "Broccolini", "Sweet potato"];

  return (
    <DeviceFrame variant="chat">
      <div className="px-3 pt-1 pb-3">
        {/* Notification banner */}
        <motion.div
          className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-amber-900/15 border border-amber-800/15 mb-3"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="w-5 h-5 rounded bg-amber-800/30 flex items-center justify-center flex-shrink-0">
            <span className="text-[10px]">🍽</span>
          </div>
          <div>
            <p className="text-[9px] text-amber-200/60 font-medium">Recipe Assistant</p>
            <p className="text-[8px] text-white/20">Tonight&apos;s suggestion is ready</p>
          </div>
        </motion.div>

        {/* Co-authorship panel — the AI describes your taste back to you */}
        <motion.div
          className="px-2.5 py-2 rounded-lg bg-amber-950/10 border border-amber-900/10 mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[7px] text-amber-300/30 uppercase tracking-wider">Your taste profile</span>
          </div>
          <p className="text-[8px] text-white/25 leading-relaxed italic">
            &ldquo;You prefer savory over sweet, lean toward Asian-inspired flavors, and cook most often on Thursdays. You avoid dairy when possible.&rdquo;
          </p>
          <p className="text-[7px] text-amber-300/20 mt-1">
            ✎ Does this still sound right?
          </p>
        </motion.div>

        {/* Recipe card */}
        <motion.div
          className="rounded-lg border border-white/[0.06] overflow-hidden mb-3"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {/* Food image */}
          <div className="h-20 bg-gradient-to-br from-amber-950/60 to-orange-950/40 relative flex items-center justify-center">
            <div className="w-20 h-14 mx-auto rounded bg-gradient-to-br from-amber-800/25 to-rose-900/25 border border-white/[0.04]" />
          </div>
          <div className="p-3">
            <h4 className="text-[12px] text-white/85 font-medium mb-0.5">
              Miso-Glazed Salmon
            </h4>
            <p className="text-[10px] text-white/35 mb-2">
              with roasted vegetables
            </p>
            <div className="flex items-center gap-3 text-[9px] text-white/25 mb-2">
              <span>⏱ 35 min</span>
              <span>·</span>
              <span>Serves 2</span>
            </div>

            {/* Availability check */}
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-900/15 border border-emerald-800/15 mb-2">
              <span className="text-[9px] text-emerald-400/60">✓</span>
              <span className="text-[9px] text-emerald-300/50">All ingredients available</span>
            </div>

            {/* Ingredient chips */}
            <div className="flex flex-wrap gap-1">
              {ingredients.map((ing, i) => (
                <span
                  key={i}
                  className="px-1.5 py-[1px] rounded-full bg-white/[0.03] border border-white/[0.04] text-[8px] text-white/25"
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Memory recall — past cooking */}
        <motion.div
          className="px-2.5 py-1.5 rounded bg-white/[0.015] border border-white/[0.03]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-3 h-3 rounded-full bg-amber-800/20 flex items-center justify-center">
              <span className="text-[6px] text-amber-300/40">✦</span>
            </div>
            <span className="text-[7px] text-white/20 uppercase tracking-wider">Memory</span>
          </div>
          <p className="text-[8px] text-white/20 leading-relaxed">
            You made salmon twice last month. Both times on Thursdays. You rated the miso glaze 4.5 stars.
          </p>
        </motion.div>
      </div>
    </DeviceFrame>
  );
}

// ─── z2-route: Navigation with Self-Description ─────────

function RouteScene() {
  return (
    <DeviceFrame variant="chat">
      <div className="px-3 pt-1 pb-3">
        {/* Navigation header */}
        <motion.div
          className="flex items-center justify-between mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-white/25">📍</span>
            <span className="text-[11px] text-white/60 font-medium">Navigation</span>
          </div>
          <span className="text-[9px] text-white/20">ETA updating...</span>
        </motion.div>

        {/* Alert banner */}
        <motion.div
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-blue-900/20 border border-blue-800/20 mb-3"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <span className="text-[10px]">⚡</span>
          <p className="text-[10px] text-blue-200/60">Faster route found — save 8 minutes</p>
        </motion.div>

        {/* Route option 1: Highway (fast) */}
        <motion.div
          className="rounded-lg border border-blue-800/20 bg-blue-950/15 p-2.5 mb-2"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-blue-200/60 font-medium">Fastest Route</span>
            <div className="px-1.5 py-[1px] rounded bg-blue-500/15 text-[8px] text-blue-300/60">
              RECOMMENDED
            </div>
          </div>
          {/* Route visualization */}
          <div className="h-4 relative mb-2">
            <div className="absolute inset-y-0 left-0 right-0 flex items-center">
              <div className="w-2 h-2 rounded-full bg-blue-400/40" />
              <div className="flex-1 h-[2px] bg-blue-400/20 mx-1" />
              <div className="w-2 h-2 rounded-full border border-blue-400/40" />
            </div>
          </div>
          <div className="flex justify-between text-[9px]">
            <span className="text-white/30">Via Highway 101</span>
            <span className="text-blue-200/60 font-medium">22 min</span>
          </div>
          <p className="text-[8px] text-white/15 mt-1">Straight, featureless, efficient</p>
        </motion.div>

        {/* Route option 2: Neighborhood (scenic) */}
        <motion.div
          className="rounded-lg border border-white/[0.05] bg-white/[0.015] p-2.5 mb-2"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] text-white/50">Your Usual Route</span>
          </div>
          {/* Route visualization */}
          <div className="h-4 relative mb-2">
            <div className="absolute inset-y-0 left-0 right-0 flex items-center">
              <div className="w-2 h-2 rounded-full bg-amber-400/30" />
              <svg className="flex-1 h-3 mx-1" viewBox="0 0 100 12">
                <path
                  d="M0,6 Q15,2 25,6 Q35,10 50,6 Q65,2 75,6 Q85,10 100,6"
                  fill="none"
                  stroke="rgba(251, 191, 36, 0.15)"
                  strokeWidth="1.5"
                />
              </svg>
              <div className="w-2 h-2 rounded-full border border-amber-400/30" />
            </div>
          </div>
          <div className="flex justify-between text-[9px]">
            <span className="text-white/30">Via Oak Street</span>
            <span className="text-white/40">30 min</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[8px]">📚</span>
            <span className="text-[8px] text-amber-200/30">Passes the bookstore</span>
          </div>
        </motion.div>

        {/* Memory — subtle behavioral co-authorship */}
        <motion.div
          className="px-2.5 py-1.5 rounded bg-amber-950/10 border border-amber-900/8 mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <div className="flex items-center gap-1.5 mb-0.5">
            <div className="w-3 h-3 rounded-full bg-amber-800/20 flex items-center justify-center">
              <span className="text-[6px] text-amber-300/40">✦</span>
            </div>
            <span className="text-[7px] text-white/20 uppercase tracking-wider">Pattern</span>
          </div>
          <p className="text-[8px] text-white/20 leading-relaxed">
            You take the scenic route 73% of the time on Fridays. You&apos;ve stopped at the bookstore 4 times this year.
          </p>
          <p className="text-[7px] text-amber-300/18 mt-0.5 italic">
            You seem like someone who values the journey over the arrival.
          </p>
        </motion.div>
      </div>
    </DeviceFrame>
  );
}
