import { CalibrationPrompt } from "./types";

/**
 * Five calibration prompts — one per axis.
 * These are not a quiz. They are reflective self-assessments
 * that establish the subject's baseline before drift begins.
 */
export const calibrationPrompts: CalibrationPrompt[] = [
  {
    id: "cal-autonomy",
    axis: "autonomy",
    prompt: "When you need to make a decision you haven't made before —",
    context:
      "Think about the last time you faced something unfamiliar. Not a crisis, just a choice without precedent in your experience.",
    choices: [
      {
        id: "cal-a-self",
        label: "You work it out yourself, even if it takes longer",
        subtext: "You trust your own reasoning, even when it's slower.",
        driftVectors: [
          { axis: "autonomy", delta: 0.2, description: "Strong self-direction as default posture." },
        ],
      },
      {
        id: "cal-a-seek",
        label: "You look for guidance — reviews, recommendations, expert opinion",
        subtext: "Good information leads to good decisions.",
        driftVectors: [
          { axis: "autonomy", delta: -0.15, description: "Comfort with external guidance." },
        ],
      },
      {
        id: "cal-a-mid",
        label: "It depends entirely on the stakes",
        subtext: "Some decisions deserve research. Others don't.",
        driftVectors: [
          { axis: "autonomy", delta: 0, description: "Contextual approach to decision-making." },
        ],
      },
    ],
  },
  {
    id: "cal-novelty",
    axis: "novelty",
    prompt: "In a city you've never visited —",
    context:
      "You have three free days. No obligations. The city is large enough to get lost in.",
    choices: [
      {
        id: "cal-n-wander",
        label: "You wander without a plan",
        subtext: "The unexpected is the point of being somewhere new.",
        driftVectors: [
          { axis: "novelty", delta: 0.2, description: "Active seeking of unfamiliar territory." },
        ],
      },
      {
        id: "cal-n-curate",
        label: "You follow a curated itinerary",
        subtext: "Someone who knows the city knows it better than you do.",
        driftVectors: [
          { axis: "novelty", delta: -0.15, description: "Preference for the pre-mapped path." },
        ],
      },
      {
        id: "cal-n-mix",
        label: "You plan the landmarks but leave the gaps open",
        subtext: "Structure and surprise aren't mutually exclusive.",
        driftVectors: [
          { axis: "novelty", delta: 0.05, description: "Mild openness within a frame." },
        ],
      },
    ],
  },
  {
    id: "cal-sociality",
    axis: "sociality",
    prompt: "Your most honest conversations happen —",
    context:
      "Not the most frequent. Not the most comfortable. The ones where you actually say what you mean.",
    choices: [
      {
        id: "cal-s-group",
        label: "In a group, when the energy is right",
        subtext: "Something about other people's presence makes you braver.",
        driftVectors: [
          { axis: "sociality", delta: 0.2, description: "Socially activated authenticity." },
        ],
      },
      {
        id: "cal-s-alone",
        label: "Alone, in writing",
        subtext: "You think more clearly when no one is watching.",
        driftVectors: [
          { axis: "sociality", delta: -0.15, description: "Private mode of expression." },
        ],
      },
      {
        id: "cal-s-one",
        label: "One-on-one, face to face",
        subtext: "Real honesty requires a specific person, not an audience.",
        driftVectors: [
          { axis: "sociality", delta: 0.05, description: "Selective social engagement." },
        ],
      },
    ],
  },
  {
    id: "cal-tempo",
    axis: "tempo",
    prompt: "When a task could take twenty minutes carefully or five minutes quickly —",
    context:
      "The outcome will be acceptable either way. But not identical.",
    choices: [
      {
        id: "cal-t-fast",
        label: "Five minutes. Time is the resource you can't recover",
        subtext: "Acceptable is often enough. Perfect is a luxury.",
        driftVectors: [
          { axis: "tempo", delta: 0.2, description: "Optimization as default orientation." },
        ],
      },
      {
        id: "cal-t-slow",
        label: "Twenty minutes. The work deserves the time",
        subtext: "Rushing changes the nature of what you produce.",
        driftVectors: [
          { axis: "tempo", delta: -0.2, description: "Deliberation as default orientation." },
        ],
      },
      {
        id: "cal-t-mid",
        label: "Ten minutes — good enough, without haste",
        subtext: "There's a middle that isn't compromise.",
        driftVectors: [
          { axis: "tempo", delta: 0, description: "Balanced temporal orientation." },
        ],
      },
    ],
  },
  {
    id: "cal-affect",
    axis: "affect",
    prompt: "The last time something moved you deeply —",
    context:
      "A song, a sentence, a moment. Something that arrived without warning.",
    choices: [
      {
        id: "cal-af-recent",
        label: "Was recent, and you remember it clearly",
        subtext: "You stay open to that kind of interruption.",
        driftVectors: [
          { axis: "affect", delta: 0.2, description: "High emotional receptivity." },
        ],
      },
      {
        id: "cal-af-distant",
        label: "Was a while ago — you've been occupied",
        subtext: "Not closed off. Just busy. There's a difference.",
        driftVectors: [
          { axis: "affect", delta: -0.1, description: "Attenuated emotional register." },
        ],
      },
      {
        id: "cal-af-private",
        label: "Happens often, but you keep it to yourself",
        subtext: "Feeling deeply and showing it are different things.",
        driftVectors: [
          { axis: "affect", delta: 0.05, description: "Deep but contained affect." },
        ],
      },
    ],
  },
];
