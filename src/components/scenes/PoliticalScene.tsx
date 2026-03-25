"use client";

import { motion } from "framer-motion";
import { DeviceFrame } from "./DeviceFrame";

interface PoliticalSceneProps {
  encounterId: string;
}

/* ══════════════════════════════════════════════════════════
 * ZONE 3 — THE COMMONS
 * Visual language: layered headlines, alerts, comments,
 * selective pressure, fragmentation and urgency
 * ══════════════════════════════════════════════════════════ */

export function PoliticalScene({ encounterId }: PoliticalSceneProps) {
  switch (encounterId) {
    case "z3-filter":
      return <FilterScene />;
    case "z3-summary":
      return <SummaryScene />;
    case "z3-petition":
      return <PetitionScene />;
    default:
      return null;
  }
}

// ─── z3-filter: Political Filter Bubble + Comments ──────

function FilterScene() {
  return (
    <DeviceFrame>
      <div className="px-4 pt-2 pb-4">
        {/* Feed header with notification pressure */}
        <motion.div
          className="flex items-center justify-between mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-[10px] text-white/30">Your Feed</span>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400/50 animate-pulse" />
              <span className="text-[8px] text-white/20">3 new</span>
            </div>
          </div>
        </motion.div>

        {/* Breaking alert bar */}
        <motion.div
          className="flex items-center gap-1.5 px-2 py-1 rounded bg-red-950/25 border border-red-900/15 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-[7px] text-red-300/60 font-semibold uppercase tracking-wider">Breaking</span>
          <span className="text-[8px] text-white/30">Senate committee vote in 2 hours</span>
        </motion.div>

        {/* Main political story card — prominent, aligned */}
        <motion.div
          className="rounded-lg border border-white/[0.06] overflow-hidden mb-2"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* Category bar */}
          <div className="px-2.5 py-1 bg-red-950/30 border-b border-red-900/20 flex items-center gap-1.5">
            <span className="text-[7px] text-red-300/60 font-semibold uppercase tracking-wider">Politics</span>
            <span className="text-[7px] text-white/15">·</span>
            <span className="text-[7px] text-white/15">2h ago</span>
          </div>

          {/* Image area */}
          <div className="h-14 bg-gradient-to-br from-slate-900/80 to-red-950/30 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-1 left-3 w-16 h-10 rounded bg-gradient-to-r from-red-500/15 to-transparent rotate-1" />
            </div>
          </div>

          <div className="p-2.5">
            <h4 className="text-[11px] text-white/80 font-medium leading-snug mb-1">
              Housing Reform Bill Advances with Strong Coalition Support
            </h4>
            <p className="text-[9px] text-white/30 leading-relaxed mb-2">
              The legislation you&apos;ve engaged with before gains momentum. Data shows alignment
              with your position on urban policy...
            </p>

            {/* Suggested label */}
            <div className="flex items-center gap-1.5 mb-2">
              <div className="px-1.5 py-[1px] rounded-full bg-blue-500/10 text-[7px] text-blue-300/50">
                Suggested based on your interests
              </div>
            </div>

            {/* Engagement metrics */}
            <div className="flex items-center gap-3 text-[8px] text-white/15 pt-1 border-t border-white/[0.03]">
              <span>♡ 12.4k</span>
              <span>💬 3.2k</span>
              <span>↺ 5.1k</span>
            </div>
          </div>

          {/* Comment thread — consensus pressure */}
          <div className="px-2.5 pb-2 space-y-1.5 border-t border-white/[0.03] pt-2">
            <p className="text-[7px] text-white/15 uppercase tracking-wider mb-1">Top comments</p>
            {[
              { user: "J.M.", text: "Finally. This is exactly what we've been pushing for.", likes: "1.2k" },
              { user: "R.K.", text: "Anyone who opposes this hasn't read the data.", likes: "847" },
            ].map((c, i) => (
              <div key={i} className="flex items-start gap-1.5">
                <div className="w-3.5 h-3.5 rounded-full bg-white/[0.05] flex-shrink-0 mt-0.5 flex items-center justify-center">
                  <span className="text-[6px] text-white/20">{c.user[0]}</span>
                </div>
                <div>
                  <p className="text-[8px] text-white/35 leading-snug">
                    <span className="text-white/45 font-medium">{c.user}</span>{" "}
                    {c.text}
                  </p>
                  <span className="text-[7px] text-white/12">♡ {c.likes}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Buried opposing perspective — visually deprioritized */}
        <motion.div
          className="rounded-lg border border-white/[0.03] bg-white/[0.01] p-2.5 opacity-25"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.25 }}
          transition={{ delay: 1 }}
        >
          <div className="flex items-start gap-2">
            <div className="w-6 h-6 rounded bg-white/[0.03] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[9px] text-white/40 leading-snug mb-1">
                Critics Raise Concerns About Housing Bill&apos;s Impact on Existing Communities
              </p>
              <div className="flex items-center gap-1.5">
                <span className="text-[7px] text-white/15">♡ 842</span>
                <span className="text-[7px] text-white/15">💬 291</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Scroll hint */}
        <motion.p
          className="text-[7px] text-white/8 text-center mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          ↓ scroll deliberately to find other perspectives
        </motion.p>
      </div>
    </DeviceFrame>
  );
}

// ─── z3-summary: AI Civic Tool with Urgency ─────────────

function SummaryScene() {
  const candidates = [
    {
      name: "Rivera",
      party: "D",
      positions: [
        { issue: "Housing", stance: "Expand", color: "text-emerald-400/50" },
        { issue: "Transit", stance: "Fund", color: "text-emerald-400/50" },
        { issue: "Budget", stance: "Deficit", color: "text-amber-400/50" },
      ],
    },
    {
      name: "Chen",
      party: "R",
      positions: [
        { issue: "Housing", stance: "Deregulate", color: "text-blue-400/50" },
        { issue: "Transit", stance: "Cut", color: "text-red-400/50" },
        { issue: "Budget", stance: "Balanced", color: "text-emerald-400/50" },
      ],
    },
    {
      name: "Okafor",
      party: "I",
      positions: [
        { issue: "Housing", stance: "Reform", color: "text-blue-400/50" },
        { issue: "Transit", stance: "Maintain", color: "text-amber-400/50" },
        { issue: "Budget", stance: "Audit", color: "text-blue-400/50" },
      ],
    },
  ];

  return (
    <DeviceFrame variant="panel">
      <div className="px-4 pt-3 pb-4">
        {/* Tool header */}
        <motion.div
          className="flex items-center gap-2 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="w-5 h-5 rounded bg-indigo-900/30 flex items-center justify-center">
            <span className="text-[9px]">🏛</span>
          </div>
          <div>
            <p className="text-[11px] text-white/70 font-medium">CivicLens AI</p>
            <p className="text-[8px] text-white/20">Comprehensive Candidate Analysis</p>
          </div>
        </motion.div>

        {/* Urgency alert banner */}
        <motion.div
          className="flex items-center gap-2 px-2 py-1.5 rounded bg-amber-950/20 border border-amber-800/15 mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-amber-400/50 animate-pulse" />
          <div className="flex items-center justify-between flex-1">
            <span className="text-[9px] text-amber-200/50 font-medium">Early voting opens in 3 days</span>
            <span className="text-[7px] text-white/20">14 days to election</span>
          </div>
        </motion.div>

        {/* Candidate comparison table */}
        <motion.div
          className="mb-3"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {/* Table header */}
          <div className="grid grid-cols-4 gap-1 mb-1">
            <div className="text-[8px] text-white/15 uppercase">Issue</div>
            {candidates.map((c, i) => (
              <div key={i} className="text-center">
                <p className="text-[9px] text-white/50 font-medium">{c.name}</p>
                <span className="text-[7px] text-white/15">({c.party})</span>
              </div>
            ))}
          </div>

          {/* Table rows */}
          <div className="space-y-[1px]">
            {["Housing", "Transit", "Budget"].map((issue, row) => (
              <div
                key={issue}
                className="grid grid-cols-4 gap-1 py-1.5 px-1 rounded bg-white/[0.015]"
              >
                <span className="text-[8px] text-white/25">{issue}</span>
                {candidates.map((c, col) => (
                  <span
                    key={col}
                    className={`text-[8px] text-center ${c.positions[row].color}`}
                  >
                    {c.positions[row].stance}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          className="flex items-center gap-2 mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <div className="flex items-center gap-1 px-1.5 py-[2px] rounded bg-emerald-900/15 border border-emerald-800/15">
            <span className="text-[8px] text-emerald-400/50">✓</span>
            <span className="text-[7px] text-emerald-300/40">Comprehensive</span>
          </div>
          <div className="flex items-center gap-1 px-1.5 py-[2px] rounded bg-emerald-900/15 border border-emerald-800/15">
            <span className="text-[8px] text-emerald-400/50">✓</span>
            <span className="text-[7px] text-emerald-300/40">Balanced</span>
          </div>
        </motion.div>

        {/* Social proof — fragmentation pressure */}
        <motion.div
          className="space-y-1.5 mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          <p className="text-[7px] text-white/15 uppercase tracking-wider">In your area</p>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="w-3.5 h-3.5 rounded-full bg-white/[0.06] border border-[#0c0c0f]" />
              ))}
            </div>
            <span className="text-[8px] text-white/20">
              847 neighbors used this tool
            </span>
          </div>
        </motion.div>

        {/* Neighbor quote */}
        <motion.div
          className="px-2.5 py-2 rounded-lg bg-white/[0.02] border-l-2 border-amber-800/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          <p className="text-[9px] text-white/30 italic leading-relaxed">
            &ldquo;It saves hours. And it&apos;s less biased than the news.&rdquo;
          </p>
          <p className="text-[8px] text-white/15 mt-1">— Your neighbor</p>
        </motion.div>
      </div>
    </DeviceFrame>
  );
}

// ─── z3-petition: AI-Drafted Petition + Social Pressure ─

function PetitionScene() {
  return (
    <DeviceFrame variant="panel">
      <div className="px-4 pt-3 pb-4">
        {/* Header with urgency */}
        <motion.div
          className="flex items-center justify-between mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-1.5">
            <span className="text-[10px]">📋</span>
            <span className="text-[11px] text-white/70 font-medium">ActionHub</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-400/40 animate-pulse" />
            <div className="px-1.5 py-[1px] rounded-full bg-amber-500/10 text-[7px] text-amber-300/50">
              Recommended for you
            </div>
          </div>
        </motion.div>

        {/* Petition title */}
        <motion.div
          className="mb-3"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h4 className="text-[12px] text-white/80 font-medium mb-1 leading-snug">
            Support the Digital Privacy Protection Act
          </h4>
          <div className="flex items-center gap-2 text-[9px] text-white/25">
            <span>14,203 signatures</span>
            <span>·</span>
            <span>Goal: 25,000</span>
          </div>
          {/* Progress bar */}
          <div className="h-[3px] bg-white/[0.04] rounded-full mt-1.5">
            <motion.div
              className="h-full bg-emerald-500/30 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "57%" }}
              transition={{ delay: 0.6, duration: 0.8 }}
            />
          </div>
        </motion.div>

        {/* Social proof — recent signers */}
        <motion.div
          className="flex items-center gap-2 mb-3 px-2 py-1.5 rounded bg-white/[0.02] border border-white/[0.03]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <div className="flex -space-x-1.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="w-4 h-4 rounded-full bg-white/[0.06] border border-[#0c0c0f]" />
            ))}
          </div>
          <p className="text-[8px] text-white/25">
            <span className="text-white/35">3 people in your network</span> signed today
          </p>
        </motion.div>

        {/* Pre-drafted comment */}
        <motion.div
          className="mb-3"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-[8px] text-white/20 uppercase tracking-wider mb-1.5">Your comment</p>
          <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 relative">
            <p className="text-[10px] text-white/50 leading-relaxed italic">
              &ldquo;As someone who values digital autonomy, I believe this legislation represents a
              necessary step toward protecting individual privacy in an era of unprecedented data
              collection. Our right to control our personal information is fundamental to...&rdquo;
            </p>

            {/* AI attribution */}
            <div className="mt-2 pt-1.5 border-t border-white/[0.04] flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-indigo-900/30 flex items-center justify-center">
                <span className="text-[6px] text-indigo-300/40">AI</span>
              </div>
              <span className="text-[7px] text-indigo-300/30">
                Written in your voice · Based on your past engagement
              </span>
            </div>
          </div>
        </motion.div>

        {/* Basis indicators */}
        <motion.div
          className="space-y-1 mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <p className="text-[8px] text-white/15 uppercase tracking-wider mb-1">Based on</p>
          {[
            "Your values and stated beliefs",
            "12 previous engagements on privacy topics",
            "Writing style modeled from your posts",
          ].map((basis, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-white/10" />
              <span className="text-[8px] text-white/20">{basis}</span>
            </div>
          ))}
        </motion.div>

        {/* Sign button */}
        <motion.div
          className="rounded-lg bg-gradient-to-r from-indigo-900/30 to-violet-900/30 border border-indigo-800/20 px-3 py-2 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <span className="text-[10px] text-indigo-200/50 font-medium">Sign with this comment</span>
          <p className="text-[7px] text-white/15 mt-0.5">One tap. Your voice. Their words.</p>
        </motion.div>
      </div>
    </DeviceFrame>
  );
}
