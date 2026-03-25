"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import { DriftProfile } from "@/engine/types";

interface SubjectPortraitProps {
  profile: DriftProfile;
  size?: number;
  className?: string;
}

/**
 * A recognisably human portrait — head, face, upper bust.
 * Serious, elegant, with restrained cybernetic overlay.
 *
 * Drift axes map to subtle visual shifts:
 *   Autonomy  → eye openness, gaze direction
 *   Novelty   → iris hue shift, hair highlight variation
 *   Sociality → cybernetic connection density
 *   Tempo     → pulse animation speed
 *   Affect    → warmth/luminance, mouth expression
 */
export function SubjectPortrait({ profile, size = 200, className }: SubjectPortraitProps) {
  const uid = useId().replace(/:/g, "");
  const { autonomy, novelty, sociality, tempo, affect } = profile;

  // ─── DERIVED VISUAL PARAMETERS ───────────────────────────

  // Skin
  const skinHue = 28 + novelty * 5;
  const skinSat = 28 + affect * 8;
  const skinLight = 72 + affect * 5;
  const skin = hsl(skinHue, skinSat, skinLight);
  const skinShade = hsl(skinHue, skinSat + 5, skinLight - 14);
  const skinDeep = hsl(skinHue, skinSat + 3, skinLight - 22);

  // Hair
  const hairHue = skinHue - 3;
  const hairSat = 18 + novelty * 5;
  const hairLight = 22 + affect * 4;
  const hair = hsl(hairHue, hairSat, hairLight);
  const hairHi = hsl(hairHue + novelty * 12, hairSat + 5, hairLight + 12);

  // Eyes
  const irisHue = 38 + novelty * 30;
  const irisSat = 35 + Math.abs(novelty) * 20;
  const iris = hsl(irisHue, irisSat, 42);
  const eyeOpen = 0.75 + autonomy * 0.25; // 0.5–1.0
  const pupilDx = -autonomy * 1.2;

  // Mouth
  const mouthDy = affect * 1.5; // positive affect → subtle smile (control point moves UP = negative y)

  // Brows
  const browLift = autonomy * 2; // autonomous → slightly raised

  // Cybernetic
  const cyberAlpha = 0.15 + (1 + sociality) * 0.15;
  const cyberNodes = Math.max(2, Math.round(3 + sociality * 2));
  const pulseSec = 4 - tempo * 1.5;
  const accentHue = skinHue;
  const cyberStroke = hsla(accentHue, 30, 58, cyberAlpha);
  const cyberFill = hsla(accentHue, 35, 62, cyberAlpha);

  // Glow
  const glowAlpha = 0.06 + (1 + affect) * 0.06;

  // Clothing
  const cloth = hsl(hairHue + 5, 10, 16);
  const clothEdge = hsl(hairHue + 5, 8, 22);

  // ─── EYE GEOMETRY ────────────────────────────────────────

  const eH = 4 + eyeOpen * 5.5;
  const eBot = eH * 0.6;

  const lEye = almondPath(82, 96, 11, eH, eBot);
  const rEye = almondPath(118, 96, 11, eH, eBot);

  const lIrisX = 82 + pupilDx;
  const rIrisX = 118 + pupilDx;
  const irisY = 95.5;
  const irisR = 5.5;
  const pupilR = 2.8;

  // ─── CYBERNETIC TRACE ────────────────────────────────────

  const tracePoints = [
    { x: 144, y: 60 },
    { x: 150, y: 72 },
    { x: 153, y: 86 },
    { x: 151, y: 100 },
    { x: 147, y: 113 },
  ].slice(0, cyberNodes);

  const tracePath =
    "M" +
    tracePoints.map((p) => `${p.x},${p.y}`).join(" L");

  // ─── RENDER ──────────────────────────────────────────────

  return (
    <div className={className}>
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        className="overflow-visible"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <defs>
          <clipPath id={`${uid}-le`}>
            <path d={lEye} />
          </clipPath>
          <clipPath id={`${uid}-re`}>
            <path d={rEye} />
          </clipPath>
          <radialGradient id={`${uid}-glow`} cx="50%" cy="42%" r="50%">
            <stop offset="0%" stopColor={hsla(accentHue, 25, 55, glowAlpha)} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <linearGradient id={`${uid}-faceG`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={skin} />
            <stop offset="85%" stopColor={skin} />
            <stop offset="100%" stopColor={skinShade} />
          </linearGradient>
        </defs>

        {/* ── Ambient glow ── */}
        <circle cx={100} cy={88} r={88} fill={`url(#${uid}-glow)`} />

        {/* ── Shoulders ── */}
        <path
          d="M84,172 C66,176 38,186 18,198 L18,200 L182,200 L182,198 C162,186 134,176 116,172 Z"
          fill={cloth}
        />
        {/* Collar */}
        <path
          d="M90,172 C94,178 97,182 100,184 C103,182 106,178 110,172"
          fill="none"
          stroke={clothEdge}
          strokeWidth={0.8}
        />

        {/* ── Neck ── */}
        <path
          d="M91,145 C90,155 89,164 89,172 L111,172 C111,164 110,155 109,145"
          fill={skin}
        />
        <path
          d="M91,145 C90,155 89,164 89,172 L111,172 C111,164 110,155 109,145"
          fill={skinShade}
          opacity={0.12}
        />
        {/* Throat shadow */}
        <path
          d="M96,148 Q100,155 104,148"
          fill="none"
          stroke={skinShade}
          strokeWidth={0.6}
          opacity={0.15}
        />

        {/* ── Head / face (skin base) ── */}
        <path
          d={`
            M100,152
            C86,152 76,142 72,128
            C66,112 64,96 66,78
            C68,64 76,52 86,46
            C93,42 97,40 100,40
            C103,40 107,42 114,46
            C124,52 132,64 134,78
            C136,96 134,112 128,128
            C124,142 114,152 100,152 Z
          `}
          fill={`url(#${uid}-faceG)`}
        />

        {/* ── Face contour shadows ── */}
        {/* Temple shadows */}
        <path
          d="M72,65 C70,72 68,82 67,90"
          fill="none" stroke={skinShade} strokeWidth={6} opacity={0.06} strokeLinecap="round"
        />
        <path
          d="M128,65 C130,72 132,82 133,90"
          fill="none" stroke={skinShade} strokeWidth={6} opacity={0.06} strokeLinecap="round"
        />
        {/* Cheekbone */}
        <path
          d="M70,108 Q74,118 80,126"
          fill="none" stroke={skinShade} strokeWidth={4} opacity={0.06} strokeLinecap="round"
        />
        <path
          d="M130,108 Q126,118 120,126"
          fill="none" stroke={skinShade} strokeWidth={4} opacity={0.06} strokeLinecap="round"
        />
        {/* Under-eye hollow */}
        <ellipse cx={82} cy={102} rx={8} ry={3} fill={skinShade} opacity={0.05} />
        <ellipse cx={118} cy={102} rx={8} ry={3} fill={skinShade} opacity={0.05} />
        {/* Jaw definition */}
        <path
          d="M78,138 C84,146 92,150 100,152 C108,150 116,146 122,138"
          fill="none" stroke={skinShade} strokeWidth={0.6} opacity={0.1}
        />

        {/* ── Ears ── */}
        <path
          d="M65,90 C59,90 56,96 57,102 C58,108 61,112 65,110"
          fill={skin} stroke={skinShade} strokeWidth={0.5} opacity={0.9}
        />
        <path
          d="M135,90 C141,90 144,96 143,102 C142,108 139,112 135,110"
          fill={skin} stroke={skinShade} strokeWidth={0.5} opacity={0.9}
        />
        {/* Inner ear detail */}
        <path
          d="M62,94 C60,98 60,104 62,107"
          fill="none" stroke={skinShade} strokeWidth={0.4} opacity={0.2}
        />
        <path
          d="M138,94 C140,98 140,104 138,107"
          fill="none" stroke={skinShade} strokeWidth={0.4} opacity={0.2}
        />

        {/* ── Eyebrows ── */}
        <path
          d={`M70,${85 - browLift} Q76,${80 - browLift * 1.3} 82,${80 - browLift} Q88,${80.5 - browLift * 0.8} 93,${82 - browLift * 0.5}`}
          fill="none" stroke={hair} strokeWidth={1.6} strokeLinecap="round" opacity={0.65}
        />
        <path
          d={`M107,${82 - browLift * 0.5} Q112,${80.5 - browLift * 0.8} 118,${80 - browLift} Q124,${80 - browLift * 1.3} 130,${85 - browLift}`}
          fill="none" stroke={hair} strokeWidth={1.6} strokeLinecap="round" opacity={0.65}
        />

        {/* ── Eyes ── */}
        {/* Left */}
        <path d={lEye} fill="#e6e2dd" />
        <g clipPath={`url(#${uid}-le)`}>
          <circle cx={lIrisX} cy={irisY} r={irisR} fill={iris} />
          <circle cx={lIrisX} cy={irisY} r={irisR} fill="none" stroke={hsl(irisHue, irisSat, 32)} strokeWidth={0.5} />
          <circle cx={lIrisX} cy={irisY} r={pupilR} fill="#111" />
          <circle cx={lIrisX - 1.5} cy={irisY - 1.5} r={1.3} fill="white" opacity={0.45} />
          <circle cx={lIrisX + 2} cy={irisY + 1} r={0.6} fill="white" opacity={0.25} />
        </g>
        <path d={lEye} fill="none" stroke={skinDeep} strokeWidth={0.7} />
        {/* Upper lid crease */}
        <path
          d={`M73,${91 - eH * 0.25} Q82,${87 - eH * 0.4} 92,${91 - eH * 0.25}`}
          fill="none" stroke={skinShade} strokeWidth={0.4} opacity={0.3}
        />
        {/* Lash line (thicker on upper outer) */}
        <path
          d={`M74,96 Q78,${96 - eH + 0.5} 82,${95 - eH} Q86,${95 - eH - 0.5} 92,${95.5 - eH * 0.6}`}
          fill="none" stroke={skinDeep} strokeWidth={0.8} opacity={0.35} strokeLinecap="round"
        />

        {/* Right */}
        <path d={rEye} fill="#e6e2dd" />
        <g clipPath={`url(#${uid}-re)`}>
          <circle cx={rIrisX} cy={irisY} r={irisR} fill={iris} />
          <circle cx={rIrisX} cy={irisY} r={irisR} fill="none" stroke={hsl(irisHue, irisSat, 32)} strokeWidth={0.5} />
          <circle cx={rIrisX} cy={irisY} r={pupilR} fill="#111" />
          <circle cx={rIrisX - 1.5} cy={irisY - 1.5} r={1.3} fill="white" opacity={0.45} />
          <circle cx={rIrisX + 2} cy={irisY + 1} r={0.6} fill="white" opacity={0.25} />
        </g>
        <path d={rEye} fill="none" stroke={skinDeep} strokeWidth={0.7} />
        <path
          d={`M108,${91 - eH * 0.25} Q118,${87 - eH * 0.4} 127,${91 - eH * 0.25}`}
          fill="none" stroke={skinShade} strokeWidth={0.4} opacity={0.3}
        />
        <path
          d={`M108,${95.5 - eH * 0.6} Q114,${95 - eH - 0.5} 118,${95 - eH} Q122,${96 - eH + 0.5} 126,96`}
          fill="none" stroke={skinDeep} strokeWidth={0.8} opacity={0.35} strokeLinecap="round"
        />

        {/* ── Nose ── */}
        <path
          d="M98,86 L97,110 Q97,116 100,118 Q103,116 103,110 L102,86"
          fill={skinShade} opacity={0.1}
        />
        <path
          d="M94,118 Q96,122 100,121 Q104,122 106,118"
          fill="none" stroke={skinShade} strokeWidth={0.7} opacity={0.3}
        />
        <ellipse cx={95.5} cy={119} rx={2.2} ry={1.6} fill={skinShade} opacity={0.1} />
        <ellipse cx={104.5} cy={119} rx={2.2} ry={1.6} fill={skinShade} opacity={0.1} />

        {/* ── Mouth ── */}
        {/* Upper lip line */}
        <path
          d={`M88,${132 + mouthDy * 0.2}
              Q93,${129 - mouthDy * 0.5} 97,${130 - mouthDy * 0.3}
              L100,${131 - mouthDy * 0.1}
              L103,${130 - mouthDy * 0.3}
              Q107,${129 - mouthDy * 0.5} 112,${132 + mouthDy * 0.2}`}
          fill="none"
          stroke={hsl(skinHue + 6, skinSat + 14, skinLight - 18)}
          strokeWidth={1}
          strokeLinecap="round"
        />
        {/* Lower lip body */}
        <path
          d={`M89,${132.5 + mouthDy * 0.2}
              Q100,${138 + mouthDy * 0.6} 111,${132.5 + mouthDy * 0.2}`}
          fill={hsla(skinHue + 8, skinSat + 12, skinLight - 6, 0.3)}
          stroke={hsl(skinHue + 5, skinSat + 10, skinLight - 14)}
          strokeWidth={0.4}
        />
        {/* Lip separation */}
        <path
          d={`M89,${132.5 + mouthDy * 0.2} Q100,${134 + mouthDy * 0.4} 111,${132.5 + mouthDy * 0.2}`}
          fill="none"
          stroke={hsl(skinHue, skinSat + 5, skinLight - 22)}
          strokeWidth={0.5}
          opacity={0.25}
        />
        {/* Lower lip shadow */}
        <path
          d={`M92,${139 + mouthDy * 0.5} Q100,${141 + mouthDy * 0.3} 108,${139 + mouthDy * 0.5}`}
          fill="none" stroke={skinShade} strokeWidth={0.5} opacity={0.1}
        />

        {/* Philtrum (subtle) */}
        <path
          d="M99,121 L98.5,129"
          fill="none" stroke={skinShade} strokeWidth={0.4} opacity={0.08}
        />
        <path
          d="M101,121 L101.5,129"
          fill="none" stroke={skinShade} strokeWidth={0.4} opacity={0.08}
        />

        {/* ── Hair (drawn ON TOP of face to frame it) ── */}
        <path
          d={`
            M48,94
            C46,70 50,44 60,30
            C72,16 86,8 100,8
            C114,8 128,16 140,30
            C150,44 154,70 152,94
            C150,104 146,108 140,104
            C136,96 130,80 122,66
            C115,52 108,47 100,47
            C92,47 85,52 78,66
            C70,80 64,96 60,104
            C54,108 50,104 48,94 Z
          `}
          fill={hair}
        />
        {/* Hair highlight / volume */}
        <path
          d={`
            M68,35
            C78,20 90,12 100,12
            C110,12 122,20 132,35
            C126,22 114,14 100,14
            C86,14 74,22 68,35 Z
          `}
          fill={hairHi}
          opacity={0.35}
        />
        {/* Hair texture strands */}
        <path d="M80,25 Q85,15 92,12" fill="none" stroke={hairHi} strokeWidth={0.4} opacity={0.2} />
        <path d="M75,35 Q80,22 90,14" fill="none" stroke={hairHi} strokeWidth={0.3} opacity={0.15} />
        <path d="M120,25 Q115,15 108,12" fill="none" stroke={hairHi} strokeWidth={0.4} opacity={0.2} />
        <path d="M125,35 Q120,22 110,14" fill="none" stroke={hairHi} strokeWidth={0.3} opacity={0.15} />
        {/* Parting suggestion */}
        <path
          d="M98,10 Q99,20 97,35 Q96,45 97,50"
          fill="none" stroke={hsl(hairHue, hairSat, hairLight - 5)} strokeWidth={0.6} opacity={0.3}
        />

        {/* ── Cybernetic overlay (restrained) ── */}
        {/* Trace line along right temple */}
        <motion.path
          d={tracePath}
          fill="none"
          stroke={cyberStroke}
          strokeWidth={0.5}
          strokeDasharray="2 4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.5, delay: 1.2 }}
        />
        {/* Trace nodes */}
        {tracePoints.map((p, i) => (
          <g key={`cn-${i}`}>
            <motion.circle
              cx={p.x} cy={p.y} r={1.3}
              fill={cyberFill}
              initial={{ opacity: 0, r: 0 }}
              animate={{ opacity: cyberAlpha, r: 1.3 }}
              transition={{ duration: 0.5, delay: 1.6 + i * 0.18 }}
            />
            <motion.circle
              cx={p.x} cy={p.y} r={1.3}
              fill="none" stroke={cyberStroke} strokeWidth={0.3}
              animate={{ r: [1.3, 5], opacity: [cyberAlpha * 0.6, 0] }}
              transition={{
                duration: pulseSec,
                repeat: Infinity,
                delay: i * (pulseSec / cyberNodes),
                ease: "easeOut",
              }}
            />
          </g>
        ))}

        {/* Micro data ticks near right eye */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: cyberAlpha * 0.45 }}
          transition={{ delay: 2.2 }}
        >
          {[91, 94, 97].map((y, i) => (
            <line
              key={y}
              x1={133}
              y1={y}
              x2={133 + 4 + i * 2}
              y2={y}
              stroke={cyberStroke}
              strokeWidth={0.35}
            />
          ))}
        </motion.g>

        {/* Faint scan line */}
        <motion.line
          x1={66} y1={40} x2={134} y2={40}
          stroke={hsla(accentHue, 25, 60, 0.06)}
          strokeWidth={0.4}
          animate={{ y1: [40, 152], y2: [40, 152] }}
          transition={{ duration: pulseSec * 2.5, repeat: Infinity, ease: "linear" }}
        />
      </motion.svg>
    </div>
  );
}

// ─── HELPERS ──────────────────────────────────────────────

function hsl(h: number, s: number, l: number): string {
  return `hsl(${h}, ${s}%, ${l}%)`;
}

function hsla(h: number, s: number, l: number, a: number): string {
  return `hsla(${h}, ${s}%, ${l}%, ${a})`;
}

/** Generate an almond-shaped eye path centered at (cx, cy). */
function almondPath(
  cx: number,
  cy: number,
  halfW: number,
  topH: number,
  botH: number
): string {
  const l = cx - halfW;
  const r = cx + halfW;
  return `
    M${l},${cy}
    C${l + 3},${cy - topH} ${cx - 4},${cy - topH - 1} ${cx},${cy - topH - 1}
    C${cx + 4},${cy - topH - 1} ${r - 3},${cy - topH} ${r},${cy}
    C${r - 3},${cy + botH} ${cx + 4},${cy + botH + 1} ${cx},${cy + botH + 1}
    C${cx - 4},${cy + botH + 1} ${l + 3},${cy + botH} ${l},${cy}
    Z
  `;
}
