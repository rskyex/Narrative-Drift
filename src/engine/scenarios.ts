import { Scenario, Chapter } from "./types";

const chapters: Record<number, Chapter> = {
  1: {
    number: 1,
    title: "The Morning Algorithm",
    zone: "Commute Corridor",
    zoneDescription: "The space between waking and arrival — where habit meets curation.",
    epigraph: "What you listen to shapes what you think before you begin to think.",
  },
  2: {
    number: 2,
    title: "The Suggested Response",
    zone: "Signal & Noise",
    zoneDescription: "The narrow channel between intention and expression.",
    epigraph: "A message composed by someone else, sent in your name, still bears your signature.",
  },
  3: {
    number: 3,
    title: "The Curated Lens",
    zone: "Information Architecture",
    zoneDescription: "The constructed view of the world you did not construct.",
    epigraph: "To see only what is relevant is to lose the capacity for surprise.",
  },
  4: {
    number: 4,
    title: "The Taste Profile",
    zone: "Domestic Threshold",
    zoneDescription: "The kitchen — where sustenance meets automation.",
    epigraph: "When the recipe is chosen for you, nourishment becomes consumption.",
  },
  5: {
    number: 5,
    title: "The Optimized Path",
    zone: "Navigation Grid",
    zoneDescription: "Every route is a choice between efficiency and encounter.",
    epigraph: "The fastest way between two points passes through nothing.",
  },
  6: {
    number: 6,
    title: "The Preference Engine",
    zone: "Marketplace of Selves",
    zoneDescription: "Where identity is inferred from purchase history.",
    epigraph: "A 95% match is a 5% erasure.",
  },
  7: {
    number: 7,
    title: "The Infinite Feed",
    zone: "Terminal Loop",
    zoneDescription: "The end of the week. The scroll that has no bottom.",
    epigraph: "The last hour of the day belongs to whoever designed the last screen you see.",
  },
};

export const scenarios: Scenario[] = [
  {
    id: "day-1-playlist",
    day: 1,
    dayName: "Monday",
    timeOfDay: "morning",
    chapter: chapters[1],
    context:
      "You're getting ready for your commute. Your music app has generated a new playlist titled \"Your Monday Mix\" — thirty tracks it selected based on your recent listening.",
    aiFraming: "Your music assistant suggests:",
    choices: [
      {
        id: "d1-accept",
        label: "Listen to the generated playlist",
        subtext: "Curated from your patterns. It knows what works.",
        driftVectors: [
          { axis: "autonomy", delta: -0.08, description: "You let the algorithm choose your soundtrack." },
          { axis: "novelty", delta: 0.06, description: "The playlist introduced unfamiliar artists." },
        ],
      },
      {
        id: "d1-own",
        label: "Put on an album you've been meaning to listen to",
        subtext: "Something a colleague mentioned last week.",
        driftVectors: [
          { axis: "autonomy", delta: 0.05, description: "You chose your own music deliberately." },
          { axis: "sociality", delta: 0.04, description: "The recommendation came from a real person." },
        ],
      },
      {
        id: "d1-silence",
        label: "Ride in silence today",
        subtext: "",
        driftVectors: [
          { axis: "autonomy", delta: 0.1, description: "You opted out of mediated experience entirely." },
          { axis: "tempo", delta: -0.06, description: "You chose slowness over stimulation." },
        ],
      },
    ],
  },
  {
    id: "day-2-reply",
    day: 2,
    dayName: "Tuesday",
    timeOfDay: "evening",
    chapter: chapters[2],
    context:
      "A friend you haven't spoken to in months texts: \"Hey, been thinking about you. How's everything going?\" Your phone offers three suggested replies.",
    aiFraming: "Smart Reply suggests:",
    choices: [
      {
        id: "d2-quick",
        label: "\"Good! Really busy lately but can't complain 😊\"",
        subtext: "Suggested reply — optimized for warmth and brevity.",
        driftVectors: [
          { axis: "autonomy", delta: -0.1, description: "You used the AI's words instead of your own." },
          { axis: "tempo", delta: 0.08, description: "You chose speed over thoughtfulness." },
          { axis: "affect", delta: -0.05, description: "The reply was warm but impersonal." },
        ],
      },
      {
        id: "d2-type",
        label: "Type out your own reply",
        subtext: "It takes a few minutes. You rewrite it twice.",
        driftVectors: [
          { axis: "autonomy", delta: 0.1, description: "You composed your own response." },
          { axis: "tempo", delta: -0.08, description: "You chose care over convenience." },
          { axis: "affect", delta: 0.1, description: "Your words carried your actual feeling." },
        ],
      },
      {
        id: "d2-later",
        label: "Save it for later — you'll reply tonight",
        subtext: "You close the app. The notification badge stays.",
        driftVectors: [
          { axis: "sociality", delta: -0.08, description: "You deferred connection." },
          { axis: "tempo", delta: -0.04, description: "You chose to wait, but may forget." },
        ],
      },
    ],
  },
  {
    id: "day-3-news",
    day: 3,
    dayName: "Wednesday",
    timeOfDay: "morning",
    chapter: chapters[3],
    context:
      "Over breakfast, you open your news app. The feed is arranged by an algorithm that has learned your reading patterns over two years. Today's top story is about a policy issue you've read about before. Below it, three stories you'd never have sought out.",
    aiFraming: "Your personalized feed presents:",
    choices: [
      {
        id: "d3-top",
        label: "Read the top story — it's already relevant to you",
        subtext: "The algorithm surfaced it because you've engaged with this topic before.",
        driftVectors: [
          { axis: "autonomy", delta: -0.06, description: "You followed the algorithm's priority ranking." },
          { axis: "novelty", delta: -0.08, description: "You stayed within your established interests." },
        ],
      },
      {
        id: "d3-explore",
        label: "Scroll past and read one of the unfamiliar stories",
        subtext: "Something about marine biology. You've never clicked on this before.",
        driftVectors: [
          { axis: "novelty", delta: 0.12, description: "You pursued something outside your profile." },
          { axis: "autonomy", delta: 0.04, description: "You overrode the feed's suggestion." },
        ],
      },
      {
        id: "d3-close",
        label: "Close the app — you'll catch up later",
        subtext: "You finish breakfast without a screen.",
        driftVectors: [
          { axis: "autonomy", delta: 0.08, description: "You rejected the curated feed entirely." },
          { axis: "tempo", delta: -0.06, description: "You chose presence over information." },
        ],
      },
    ],
  },
  {
    id: "day-4-dinner",
    day: 4,
    dayName: "Thursday",
    timeOfDay: "evening",
    chapter: chapters[4],
    context:
      "You're deciding what to cook for dinner. A recipe app sends a push notification: \"Based on what's in season and your dietary preferences, try this: Miso-glazed salmon with roasted vegetables.\" You have the ingredients.",
    aiFraming: "Your recipe assistant recommends:",
    choices: [
      {
        id: "d4-follow",
        label: "Follow the suggested recipe",
        subtext: "It's tailored to your taste profile. The steps are clear.",
        driftVectors: [
          { axis: "autonomy", delta: -0.08, description: "You cooked what the app told you to." },
          { axis: "tempo", delta: 0.06, description: "The decision was made instantly." },
          { axis: "novelty", delta: 0.04, description: "The recipe was new, even if chosen for you." },
        ],
      },
      {
        id: "d4-improvise",
        label: "Cook something from memory — no recipe",
        subtext: "That pasta your mother used to make. You know it by feel.",
        driftVectors: [
          { axis: "autonomy", delta: 0.1, description: "You relied on your own knowledge." },
          { axis: "novelty", delta: -0.06, description: "You chose the deeply familiar." },
          { axis: "affect", delta: 0.08, description: "Cooking from memory carried emotional weight." },
        ],
      },
      {
        id: "d4-order",
        label: "Order delivery instead — it's been a long day",
        subtext: "The app already knows your usual order.",
        driftVectors: [
          { axis: "autonomy", delta: -0.12, description: "You defaulted to a pre-learned preference." },
          { axis: "tempo", delta: 0.1, description: "You chose maximum convenience." },
        ],
      },
    ],
  },
  {
    id: "day-5-route",
    day: 5,
    dayName: "Friday",
    timeOfDay: "afternoon",
    chapter: chapters[5],
    context:
      "You're driving to meet a friend across town. Your navigation app recalculates: \"A faster route has been found. Save 8 minutes.\" The faster route takes the highway. Your usual route goes through the neighborhood with the old bookstore.",
    aiFraming: "Navigation suggests:",
    choices: [
      {
        id: "d5-faster",
        label: "Take the faster route",
        subtext: "Eight minutes saved. Arrival time: 3:12 PM.",
        driftVectors: [
          { axis: "tempo", delta: 0.1, description: "You optimized for speed." },
          { axis: "autonomy", delta: -0.06, description: "You followed the algorithm's route." },
          { axis: "novelty", delta: -0.04, description: "The highway is featureless." },
        ],
      },
      {
        id: "d5-scenic",
        label: "Keep your usual route through the neighborhood",
        subtext: "You might stop at the bookstore. You might not.",
        driftVectors: [
          { axis: "autonomy", delta: 0.08, description: "You chose your own path." },
          { axis: "tempo", delta: -0.08, description: "You chose the slower, richer option." },
          { axis: "novelty", delta: 0.04, description: "The neighborhood always has something new." },
        ],
      },
      {
        id: "d5-dismiss",
        label: "Dismiss the notification and drive from memory",
        subtext: "You turn off navigation. You know the way.",
        driftVectors: [
          { axis: "autonomy", delta: 0.12, description: "You navigated without assistance." },
          { axis: "tempo", delta: -0.04, description: "Without optimization, you're slightly slower." },
        ],
      },
    ],
  },
  {
    id: "day-6-purchase",
    day: 6,
    dayName: "Saturday",
    timeOfDay: "afternoon",
    chapter: chapters[6],
    context:
      "You need a new pair of running shoes. An online store shows you \"Recommended for you\" — three options ranked by an algorithm that tracks your browsing history, past purchases, and what people with similar profiles bought.",
    aiFraming: "Personalized recommendations:",
    choices: [
      {
        id: "d6-recommended",
        label: "Buy the top recommendation",
        subtext: "\"95% match based on your profile.\" Free next-day delivery.",
        driftVectors: [
          { axis: "autonomy", delta: -0.1, description: "You bought what the algorithm selected for you." },
          { axis: "sociality", delta: 0.06, description: "Your choice aligned with your demographic cluster." },
          { axis: "tempo", delta: 0.08, description: "The decision took under a minute." },
        ],
      },
      {
        id: "d6-research",
        label: "Spend time reading reviews and comparing options",
        subtext: "An hour passes. You find a brand the algorithm didn't suggest.",
        driftVectors: [
          { axis: "autonomy", delta: 0.1, description: "You made an independent, researched decision." },
          { axis: "tempo", delta: -0.1, description: "You invested significant time in choosing." },
          { axis: "novelty", delta: 0.06, description: "You discovered something outside your profile." },
        ],
      },
      {
        id: "d6-store",
        label: "Go to a physical store instead",
        subtext: "Try them on. Talk to someone who works there.",
        driftVectors: [
          { axis: "autonomy", delta: 0.08, description: "You chose an unmediated experience." },
          { axis: "sociality", delta: 0.08, description: "You engaged with a real person." },
          { axis: "tempo", delta: -0.08, description: "It takes the whole afternoon." },
        ],
      },
    ],
  },
  {
    id: "day-7-scroll",
    day: 7,
    dayName: "Sunday",
    timeOfDay: "night",
    chapter: chapters[7],
    context:
      "It's late Sunday night. You're in bed, scrolling. The app shows you content it thinks you'll engage with — a mix of things you've liked before and things that are trending among people like you. You notice thirty minutes have passed.",
    aiFraming: "Your feed continues:",
    choices: [
      {
        id: "d7-continue",
        label: "Keep scrolling — there's one more interesting thread",
        subtext: "The feed adjusts in real time to what holds your attention.",
        driftVectors: [
          { axis: "autonomy", delta: -0.12, description: "You followed the feed's pull without deciding to." },
          { axis: "tempo", delta: 0.06, description: "You consumed rapidly, without pause." },
          { axis: "sociality", delta: 0.06, description: "You absorbed collective sentiment." },
          { axis: "novelty", delta: -0.04, description: "The content confirmed what you already think." },
        ],
      },
      {
        id: "d7-book",
        label: "Put the phone down and pick up a book",
        subtext: "It's been on your nightstand for two weeks.",
        driftVectors: [
          { axis: "autonomy", delta: 0.1, description: "You broke the loop deliberately." },
          { axis: "tempo", delta: -0.1, description: "You chose slowness and depth." },
          { axis: "affect", delta: 0.06, description: "The book asks more of you emotionally." },
        ],
      },
      {
        id: "d7-sleep",
        label: "Set the phone to Do Not Disturb and go to sleep",
        subtext: "Tomorrow is Monday again.",
        driftVectors: [
          { axis: "autonomy", delta: 0.06, description: "You ended the session on your terms." },
          { axis: "tempo", delta: -0.06, description: "You chose rest over stimulation." },
        ],
      },
    ],
  },
];
