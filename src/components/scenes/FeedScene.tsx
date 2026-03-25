"use client";

import { motion } from "framer-motion";
import { DeviceFrame } from "./DeviceFrame";

interface FeedSceneProps {
  encounterId: string;
}

/* ══════════════════════════════════════════════════════════
 * ZONE 1 — THE FEED
 * Visual language: mobile screens, seductive fragments,
 * thumbnails, recommendation badges, attention narrowing
 * ══════════════════════════════════════════════════════════ */

export function FeedScene({ encounterId }: FeedSceneProps) {
  switch (encounterId) {
    case "z1-playlist":
      return <PlaylistScene />;
    case "z1-news":
      return <NewsScene />;
    case "z1-scroll":
      return <ScrollScene />;
    default:
      return null;
  }
}

// ─── z1-playlist: "Your Monday Mix" ──────────────────────

function PlaylistScene() {
  const albums = [
    { bg: "from-amber-900/60 to-orange-950/80", label: "Ambient" },
    { bg: "from-slate-700/60 to-indigo-950/80", label: "Electronic" },
    { bg: "from-stone-700/60 to-rose-950/80", label: "Indie" },
    { bg: "from-teal-900/60 to-cyan-950/80", label: "Lo-Fi" },
  ];

  const tracks = [
    { title: "Familiar Echo", artist: "Nova Ambient", dur: "3:42" },
    { title: "Slow Drift", artist: "Aether", dur: "4:15" },
    { title: "Your Frequency", artist: "Glass Signal", dur: "3:28" },
    { title: "Warm Static", artist: "Liminal", dur: "5:01" },
  ];

  return (
    <DeviceFrame>
      <div className="px-4 pt-2 pb-4">
        {/* App header */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-[10px] text-white/30">♪ Music</div>
          <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full border border-white/15" />
          </div>
        </div>

        {/* Playlist header */}
        <motion.div
          className="mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-sm font-medium text-white/90 mb-0.5">Your Monday Mix</h3>
          <div className="flex items-center gap-1.5">
            <div className="px-1.5 py-[1px] rounded-full bg-emerald-500/15 text-[8px] text-emerald-400/70">
              Personalized
            </div>
            <span className="text-[9px] text-white/25">30 tracks · 2h 14m</span>
          </div>
        </motion.div>

        {/* Album art grid */}
        <motion.div
          className="grid grid-cols-4 gap-1.5 mb-4"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {albums.map((a, i) => (
            <div
              key={i}
              className={`aspect-square rounded-md bg-gradient-to-br ${a.bg} flex items-end p-1`}
            >
              <span className="text-[7px] text-white/30">{a.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Track list */}
        <div className="space-y-0.5">
          {tracks.map((t, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-2.5 py-1.5 px-1 rounded hover:bg-white/[0.02]"
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + i * 0.08 }}
            >
              <span className="text-[9px] text-white/15 w-3 text-right">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-white/70 truncate">{t.title}</p>
                <p className="text-[9px] text-white/25">{t.artist}</p>
              </div>
              <span className="text-[9px] text-white/20">{t.dur}</span>
            </motion.div>
          ))}
        </div>

        {/* Bottom: based on */}
        <motion.div
          className="mt-3 pt-2 border-t border-white/[0.04] text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <p className="text-[8px] text-white/15 italic">
            Based on 2 years of listening · 4,216 plays analyzed
          </p>
        </motion.div>
      </div>
    </DeviceFrame>
  );
}

// ─── z1-news: Personalized News Feed ─────────────────────

function NewsScene() {
  return (
    <DeviceFrame>
      <div className="px-4 pt-2 pb-4">
        {/* App header */}
        <div className="flex items-center justify-between mb-3">
          <div className="text-[10px] text-white/30">📰 Your Briefing</div>
          <div className="text-[8px] text-white/15">Wed, 7:12 AM</div>
        </div>

        {/* Top story card */}
        <motion.div
          className="rounded-lg border border-white/[0.06] overflow-hidden mb-3"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Hero image placeholder */}
          <div className="h-20 bg-gradient-to-br from-blue-950/80 to-slate-900/60 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-8 border border-white/[0.06] rounded bg-white/[0.03]" />
            </div>
            <div className="absolute top-1.5 left-1.5 px-1.5 py-[1px] rounded bg-red-500/20 text-[7px] text-red-300/70 font-medium">
              TOP STORY
            </div>
          </div>
          <div className="p-2.5">
            <h4 className="text-[11px] text-white/80 font-medium leading-snug mb-1">
              Policy Reform Gains Momentum as Senate Committee Advances Key Vote
            </h4>
            <p className="text-[9px] text-white/30 leading-relaxed mb-2">
              New analysis shows growing bipartisan support for the measure you&apos;ve followed since March...
            </p>
            <div className="flex items-center gap-1.5">
              <div className="px-1.5 py-[1px] rounded-full bg-blue-500/10 text-[7px] text-blue-300/50">
                ⓘ Suggested for you
              </div>
              <span className="text-[8px] text-white/15">4 min read</span>
            </div>
          </div>
        </motion.div>

        {/* Unfamiliar stories — deliberately smaller, faded */}
        <motion.div
          className="space-y-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-[8px] text-white/15 uppercase tracking-wider mb-1">Also today</p>
          {[
            { title: "Marine Conservation Groups Report Record Coral Recovery", time: "6 min" },
            { title: "Quantum Computing Breakthrough at MIT Draws Industry Interest", time: "5 min" },
            { title: "Local Artist Collective Opens Community Studio Downtown", time: "3 min" },
          ].map((story, i) => (
            <div
              key={i}
              className="flex items-start gap-2 py-1 px-1 opacity-40"
            >
              <div className="w-8 h-8 rounded bg-white/[0.03] border border-white/[0.04] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] text-white/50 leading-snug">{story.title}</p>
                <span className="text-[8px] text-white/15">{story.time}</span>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Scroll prompt */}
        <motion.div
          className="mt-2 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
        >
          <p className="text-[7px] text-white/10">↓ 23 more stories below your fold</p>
        </motion.div>
      </div>
    </DeviceFrame>
  );
}

// ─── z1-scroll: Late Night Infinite Scroll ───────────────

function ScrollScene() {
  const posts = [
    {
      tag: "Trending",
      text: "Why remote work isn't actually about productivity — it's about control. Thread 🧵",
      likes: "2.4k",
      shares: "891",
      color: "bg-violet-500/10 text-violet-300/60",
    },
    {
      tag: "Similar to you",
      text: "Hot take: the best decisions I ever made were the ones nobody recommended.",
      likes: "1.1k",
      shares: "342",
      color: "bg-blue-500/10 text-blue-300/60",
    },
    {
      tag: "Suggested",
      text: "Just watched this three times. The algorithm finally understood the assignment.",
      likes: "4.7k",
      shares: "1.2k",
      color: "bg-emerald-500/10 text-emerald-300/60",
    },
  ];

  return (
    <DeviceFrame>
      <div className="px-4 pt-1 pb-4">
        {/* Time indicator */}
        <motion.div
          className="flex justify-between items-center mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-[10px] text-white/20">11:47 PM</span>
          <div className="px-1.5 py-[1px] rounded-full bg-amber-500/10 text-[7px] text-amber-300/50">
            30 min in session
          </div>
        </motion.div>

        {/* Feed cards */}
        <div className="space-y-2">
          {posts.map((post, i) => (
            <motion.div
              key={i}
              className="rounded-lg border border-white/[0.05] bg-white/[0.015] p-2.5"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.15 }}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <div className="w-4 h-4 rounded-full bg-white/[0.06]" />
                <div className={`px-1.5 py-[1px] rounded-full text-[7px] ${post.color}`}>
                  {post.tag}
                </div>
              </div>
              <p className="text-[10px] text-white/60 leading-relaxed mb-2">
                {post.text}
              </p>
              <div className="flex items-center gap-3 text-[8px] text-white/15">
                <span>♡ {post.likes}</span>
                <span>↺ {post.shares}</span>
                <span>💬 reply</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Infinite scroll indicator */}
        <motion.div
          className="mt-3 flex flex-col items-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div
            className="w-4 h-4 rounded-full border border-white/10 flex items-center justify-center"
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span className="text-[8px] text-white/20">↓</span>
          </motion.div>
          <p className="text-[7px] text-white/10">The feed has no bottom</p>
        </motion.div>
      </div>
    </DeviceFrame>
  );
}
