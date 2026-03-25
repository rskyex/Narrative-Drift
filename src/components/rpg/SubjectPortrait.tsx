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
  const skinHighlight = hsl(skinHue - 2, skinSat - 5, skinLight + 6);

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
  const irisLight = hsl(irisHue, irisSat + 8, 52);
  const eyeOpen = 0.75 + autonomy * 0.25; // 0.5–1.0
  const pupilDx = -autonomy * 1.2;

  // Mouth — wider expression range
  const mouthDy = affect * 3;

  // Brows — stronger lift range
  const browLift = autonomy * 3;

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

  // ─── EYE GEOMETRY (larger, more visible) ───────────────────

  const eH = 5 + eyeOpen * 6;       // was 4+eyeOpen*5.5 → bigger range
  const eBot = eH * 0.55;

  const lEye = almondPath(82, 96, 13, eH, eBot);    // halfW 11→13
  const rEye = almondPath(118, 96, 13, eH, eBot);

  const lIrisX = 82 + pupilDx;
  const rIrisX = 118 + pupilDx;
  const irisY = 95.5;
  const irisR = 6.5;                // was 5.5 → larger iris
  const pupilR = 3.2;               // was 2.8 → proportional pupil
  const limbalR = irisR + 0.6;      // dark limbal ring around iris

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
          {/* Volumetric face gradient — light source top-left */}
          <radialGradient id={`${uid}-faceG`} cx="38%" cy="32%" r="65%" fx="38%" fy="32%">
            <stop offset="0%" stopColor={skinHighlight} />
            <stop offset="45%" stopColor={skin} />
            <stop offset="85%" stopColor={skinShade} />
            <stop offset="100%" stopColor={skinDeep} />
          </radialGradient>
          {/* Forehead highlight */}
          <radialGradient id={`${uid}-foreG`} cx="45%" cy="30%" r="30%">
            <stop offset="0%" stopColor={hsla(skinHue - 2, skinSat - 8, skinLight + 8, 0.35)} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          {/* Cheek warmth (left) */}
          <radialGradient id={`${uid}-cheekL`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={hsla(skinHue + 8, skinSat + 15, skinLight - 2, 0.12)} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          {/* Cheek warmth (right) */}
          <radialGradient id={`${uid}-cheekR`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={hsla(skinHue + 8, skinSat + 15, skinLight - 2, 0.10)} />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          {/* Nose highlight */}
          <linearGradient id={`${uid}-noseHi`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={hsla(skinHue, skinSat - 5, skinLight + 10, 0.2)} />
            <stop offset="100%" stopColor="transparent" />
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
          opacity={0.15}
        />
        {/* Neck side shadow — left */}
        <path
          d="M91,146 C90,156 89,165 89,172 L93,172 C93,165 92,156 92,148"
          fill={skinDeep} opacity={0.08}
        />
        {/* Neck side shadow — right */}
        <path
          d="M109,146 C110,156 111,165 111,172 L107,172 C107,165 108,156 108,148"
          fill={skinDeep} opacity={0.06}
        />
        {/* Throat shadow */}
        <path
          d="M96,148 Q100,155 104,148"
          fill="none"
          stroke={skinShade}
          strokeWidth={0.8}
          opacity={0.2}
        />

        {/* ── Head / face — sculpted silhouette ── */}
        <path
          d={`
            M100,152
            C88,152 78,144 73,132
            C68,120 64,106 64,90
            C64,74 68,62 76,52
            C84,42 92,38 100,38
            C108,38 116,42 124,52
            C132,62 136,74 136,90
            C136,106 132,120 127,132
            C122,144 112,152 100,152 Z
          `}
          fill={`url(#${uid}-faceG)`}
        />
        {/* Forehead highlight overlay */}
        <ellipse cx={94} cy={60} rx={22} ry={18} fill={`url(#${uid}-foreG)`} />
        {/* Cheek warmth overlays */}
        <ellipse cx={76} cy={112} rx={10} ry={8} fill={`url(#${uid}-cheekL)`} />
        <ellipse cx={124} cy={112} rx={10} ry={8} fill={`url(#${uid}-cheekR)`} />

        {/* ── Face contour shadows (stronger) ── */}
        {/* Temple shadows */}
        <path
          d="M70,62 C67,72 65,82 64,92"
          fill="none" stroke={skinDeep} strokeWidth={7} opacity={0.1} strokeLinecap="round"
        />
        <path
          d="M130,62 C133,72 135,82 136,92"
          fill="none" stroke={skinDeep} strokeWidth={5} opacity={0.07} strokeLinecap="round"
        />
        {/* Cheekbone shadow */}
        <path
          d="M68,106 Q72,118 78,128"
          fill="none" stroke={skinShade} strokeWidth={5} opacity={0.12} strokeLinecap="round"
        />
        <path
          d="M132,106 Q128,118 122,128"
          fill="none" stroke={skinShade} strokeWidth={4} opacity={0.08} strokeLinecap="round"
        />
        {/* Under-eye hollows */}
        <ellipse cx={82} cy={102} rx={9} ry={3.5} fill={skinShade} opacity={0.1} />
        <ellipse cx={118} cy={102} rx={9} ry={3.5} fill={skinShade} opacity={0.08} />
        {/* Jaw definition */}
        <path
          d="M76,136 C84,146 92,151 100,152 C108,151 116,146 124,136"
          fill="none" stroke={skinShade} strokeWidth={0.8} opacity={0.18}
        />
        {/* Chin shadow */}
        <ellipse cx={100} cy={148} rx={8} ry={3} fill={skinDeep} opacity={0.08} />

        {/* ── Ears ── */}
        <path
          d="M63,88 C57,88 54,94 55,100 C56,106 59,110 63,108"
          fill={skin} stroke={skinShade} strokeWidth={0.5} opacity={0.9}
        />
        <path
          d="M137,88 C143,88 146,94 145,100 C144,106 141,110 137,108"
          fill={skin} stroke={skinShade} strokeWidth={0.5} opacity={0.9}
        />
        {/* Inner ear detail */}
        <path
          d="M60,92 C58,96 58,102 60,105"
          fill="none" stroke={skinShade} strokeWidth={0.4} opacity={0.25}
        />
        <path
          d="M140,92 C142,96 142,102 140,105"
          fill="none" stroke={skinShade} strokeWidth={0.4} opacity={0.2}
        />

        {/* ── Eyebrows (thicker, more expressive) ── */}
        <path
          d={`M68,${85 - browLift} Q76,${79 - browLift * 1.3} 82,${79 - browLift} Q88,${79.5 - browLift * 0.8} 94,${81 - browLift * 0.5}`}
          fill="none" stroke={hair} strokeWidth={2} strokeLinecap="round" opacity={0.7}
        />
        <path
          d={`M106,${81 - browLift * 0.5} Q112,${79.5 - browLift * 0.8} 118,${79 - browLift} Q124,${79 - browLift * 1.3} 132,${85 - browLift}`}
          fill="none" stroke={hair} strokeWidth={2} strokeLinecap="round" opacity={0.7}
        />

        {/* ── Eyes (larger, more detailed) ── */}
        {/* Left eye */}
        <path d={lEye} fill="#e8e4df" />
        {/* Sclera pink tint at corners */}
        <circle cx={72} cy={96} r={3} fill={hsla(0, 30, 75, 0.08)} />
        <g clipPath={`url(#${uid}-le)`}>
          {/* Limbal ring (dark border around iris) */}
          <circle cx={lIrisX} cy={irisY} r={limbalR} fill={hsl(irisHue, irisSat, 25)} />
          {/* Iris with radial detail */}
          <circle cx={lIrisX} cy={irisY} r={irisR} fill={iris} />
          <circle cx={lIrisX} cy={irisY} r={irisR - 1.5} fill={irisLight} opacity={0.3} />
          {/* Iris texture — radial spokes */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            return (
              <line
                key={`li-${angle}`}
                x1={lIrisX + Math.cos(rad) * 2.5}
                y1={irisY + Math.sin(rad) * 2.5}
                x2={lIrisX + Math.cos(rad) * irisR}
                y2={irisY + Math.sin(rad) * irisR}
                stroke={hsl(irisHue, irisSat, 32)}
                strokeWidth={0.3}
                opacity={0.3}
              />
            );
          })}
          {/* Pupil */}
          <circle cx={lIrisX} cy={irisY} r={pupilR} fill="#0a0a0a" />
          {/* Catchlight — primary (large) */}
          <circle cx={lIrisX - 2} cy={irisY - 2} r={1.8} fill="white" opacity={0.55} />
          {/* Catchlight — secondary */}
          <circle cx={lIrisX + 2.5} cy={irisY + 1.5} r={0.8} fill="white" opacity={0.3} />
        </g>
        <path d={lEye} fill="none" stroke={skinDeep} strokeWidth={0.8} />
        {/* Upper lid crease */}
        <path
          d={`M71,${90 - eH * 0.3} Q82,${85 - eH * 0.45} 94,${90 - eH * 0.3}`}
          fill="none" stroke={skinShade} strokeWidth={0.5} opacity={0.35}
        />
        {/* Upper lash line (thicker, darker) */}
        <path
          d={`M71,96 Q76,${96 - eH + 0.3} 82,${95 - eH} Q88,${95 - eH - 0.3} 94,${95.5 - eH * 0.5}`}
          fill="none" stroke={skinDeep} strokeWidth={1.2} opacity={0.5} strokeLinecap="round"
        />
        {/* Lower lash line (subtle) */}
        <path
          d={`M73,97 Q82,${96 + eBot + 0.5} 92,97`}
          fill="none" stroke={skinShade} strokeWidth={0.4} opacity={0.15}
        />

        {/* Right eye */}
        <path d={rEye} fill="#e8e4df" />
        <circle cx={128} cy={96} r={3} fill={hsla(0, 30, 75, 0.08)} />
        <g clipPath={`url(#${uid}-re)`}>
          <circle cx={rIrisX} cy={irisY} r={limbalR} fill={hsl(irisHue, irisSat, 25)} />
          <circle cx={rIrisX} cy={irisY} r={irisR} fill={iris} />
          <circle cx={rIrisX} cy={irisY} r={irisR - 1.5} fill={irisLight} opacity={0.3} />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            return (
              <line
                key={`ri-${angle}`}
                x1={rIrisX + Math.cos(rad) * 2.5}
                y1={irisY + Math.sin(rad) * 2.5}
                x2={rIrisX + Math.cos(rad) * irisR}
                y2={irisY + Math.sin(rad) * irisR}
                stroke={hsl(irisHue, irisSat, 32)}
                strokeWidth={0.3}
                opacity={0.3}
              />
            );
          })}
          <circle cx={rIrisX} cy={irisY} r={pupilR} fill="#0a0a0a" />
          <circle cx={rIrisX - 2} cy={irisY - 2} r={1.8} fill="white" opacity={0.55} />
          <circle cx={rIrisX + 2.5} cy={irisY + 1.5} r={0.8} fill="white" opacity={0.3} />
        </g>
        <path d={rEye} fill="none" stroke={skinDeep} strokeWidth={0.8} />
        <path
          d={`M106,${90 - eH * 0.3} Q118,${85 - eH * 0.45} 129,${90 - eH * 0.3}`}
          fill="none" stroke={skinShade} strokeWidth={0.5} opacity={0.35}
        />
        <path
          d={`M106,${95.5 - eH * 0.5} Q112,${95 - eH - 0.3} 118,${95 - eH} Q124,${96 - eH + 0.3} 129,96`}
          fill="none" stroke={skinDeep} strokeWidth={1.2} opacity={0.5} strokeLinecap="round"
        />
        <path
          d={`M108,97 Q118,${96 + eBot + 0.5} 127,97`}
          fill="none" stroke={skinShade} strokeWidth={0.4} opacity={0.15}
        />

        {/* ── Nose (stronger bridge and tip) ── */}
        {/* Bridge highlight */}
        <path
          d="M99,82 L98.5,108"
          fill="none" stroke={skinHighlight} strokeWidth={2} opacity={0.15} strokeLinecap="round"
        />
        {/* Bridge shadow — left side */}
        <path
          d="M97,84 L96,110 Q96,116 100,118"
          fill="none" stroke={skinShade} strokeWidth={1.2} opacity={0.15}
        />
        {/* Bridge shadow — right side */}
        <path
          d="M103,84 L104,110 Q104,116 100,118"
          fill="none" stroke={skinShade} strokeWidth={0.8} opacity={0.08}
        />
        {/* Nostril wings */}
        <path
          d="M93,118 Q95,122 100,121 Q105,122 107,118"
          fill="none" stroke={skinShade} strokeWidth={0.8} opacity={0.35}
        />
        {/* Nostril shadows */}
        <ellipse cx={95} cy={119.5} rx={2.5} ry={1.8} fill={skinDeep} opacity={0.15} />
        <ellipse cx={105} cy={119.5} rx={2.5} ry={1.8} fill={skinDeep} opacity={0.15} />
        {/* Nose tip highlight */}
        <ellipse cx={100} cy={117} rx={3} ry={2} fill={`url(#${uid}-noseHi)`} />

        {/* ── Mouth (wider expression range) ── */}
        {/* Upper lip line — cupid's bow */}
        <path
          d={`M86,${132 + mouthDy * 0.15}
              Q92,${129 - mouthDy * 0.4} 97,${130 - mouthDy * 0.25}
              L100,${131 - mouthDy * 0.08}
              L103,${130 - mouthDy * 0.25}
              Q108,${129 - mouthDy * 0.4} 114,${132 + mouthDy * 0.15}`}
          fill="none"
          stroke={hsl(skinHue + 6, skinSat + 14, skinLight - 18)}
          strokeWidth={1.1}
          strokeLinecap="round"
        />
        {/* Lower lip body */}
        <path
          d={`M87,${132.5 + mouthDy * 0.15}
              Q100,${139 + mouthDy * 0.5} 113,${132.5 + mouthDy * 0.15}`}
          fill={hsla(skinHue + 8, skinSat + 12, skinLight - 6, 0.35)}
          stroke={hsl(skinHue + 5, skinSat + 10, skinLight - 14)}
          strokeWidth={0.5}
        />
        {/* Lower lip highlight */}
        <ellipse
          cx={100}
          cy={135 + mouthDy * 0.3}
          rx={6}
          ry={2}
          fill={hsla(skinHue, skinSat - 5, skinLight + 8, 0.12)}
        />
        {/* Lip separation */}
        <path
          d={`M87,${132.5 + mouthDy * 0.15} Q100,${134 + mouthDy * 0.35} 113,${132.5 + mouthDy * 0.15}`}
          fill="none"
          stroke={hsl(skinHue, skinSat + 5, skinLight - 22)}
          strokeWidth={0.6}
          opacity={0.3}
        />
        {/* Lower lip shadow */}
        <path
          d={`M90,${140 + mouthDy * 0.4} Q100,${142 + mouthDy * 0.25} 110,${140 + mouthDy * 0.4}`}
          fill="none" stroke={skinShade} strokeWidth={0.6} opacity={0.15}
        />

        {/* Philtrum */}
        <path
          d="M99,121 L98.5,129"
          fill="none" stroke={skinShade} strokeWidth={0.5} opacity={0.12}
        />
        <path
          d="M101,121 L101.5,129"
          fill="none" stroke={skinShade} strokeWidth={0.5} opacity={0.12}
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
