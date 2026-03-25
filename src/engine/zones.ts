import { Zone } from "./types";

export const zones: Zone[] = [
  // ═══════════════════════════════════════════════════════
  // ZONE 1 — SHORT-FORM RECOMMENDATION FEED
  // Theme: The algorithmic curation of attention
  // ═══════════════════════════════════════════════════════
  {
    id: 1,
    title: "The Feed",
    subtitle: "Algorithmic Curation of Attention",
    description:
      "Three encounters with the systems that decide what you see, hear, and read. Each has studied your patterns for years. Each believes it understands what you want better than you do.",
    epigraph:
      "The architecture of attention is the architecture of the self. What you are never shown, you can never become.",
    encounters: [
      {
        id: "z1-playlist",
        zoneId: 1,
        position: 1,
        context:
          "Monday morning. You're getting ready for your commute. Your music app has generated a new playlist titled \"Your Monday Mix\" — thirty tracks selected from your listening history, your skips, your replays. It has studied you for two years.",
        systemFraming: "Your music algorithm suggests:",
        choices: [
          {
            id: "z1e1-accept",
            label: "Listen to the generated playlist",
            subtext: "Curated from your patterns. It knows what works.",
            driftVectors: [
              { axis: "autonomy", delta: -0.08, description: "You let the algorithm choose your soundtrack." },
              { axis: "novelty", delta: 0.06, description: "The playlist introduced unfamiliar artists — chosen for you." },
            ],
          },
          {
            id: "z1e1-own",
            label: "Put on an album a colleague mentioned last week",
            subtext: "You wrote down the name. It's been sitting in your notes.",
            driftVectors: [
              { axis: "autonomy", delta: 0.06, description: "You chose your own music deliberately." },
              { axis: "sociality", delta: 0.05, description: "The recommendation came from a real person." },
            ],
          },
          {
            id: "z1e1-silence",
            label: "Ride in silence",
            subtext: "No input. No curation. Just the commute.",
            driftVectors: [
              { axis: "autonomy", delta: 0.1, description: "You opted out of mediated experience entirely." },
              { axis: "tempo", delta: -0.06, description: "You chose slowness over stimulation." },
            ],
          },
        ],
      },
      {
        id: "z1-news",
        zoneId: 1,
        position: 2,
        context:
          "Wednesday morning. Over breakfast, you open your news app. The feed is arranged by an algorithm that has learned your reading patterns over two years. Today's top story is about a policy issue you've engaged with before. Below it, three stories about subjects you've never once clicked on.",
        systemFraming: "Your personalized feed presents:",
        choices: [
          {
            id: "z1e2-top",
            label: "Read the top story — it's already relevant to you",
            subtext: "The algorithm surfaced it because you've engaged with this topic before.",
            driftVectors: [
              { axis: "autonomy", delta: -0.06, description: "You followed the algorithm's priority ranking." },
              { axis: "novelty", delta: -0.08, description: "You stayed within your established interests." },
            ],
          },
          {
            id: "z1e2-explore",
            label: "Scroll past and read one of the unfamiliar stories",
            subtext: "Something about marine conservation. You've never clicked on this before.",
            driftVectors: [
              { axis: "novelty", delta: 0.12, description: "You pursued something outside your profile." },
              { axis: "autonomy", delta: 0.05, description: "You overrode the feed's suggestion." },
            ],
          },
          {
            id: "z1e2-close",
            label: "Close the app and finish breakfast",
            subtext: "You set the phone face down. The coffee is still warm.",
            driftVectors: [
              { axis: "autonomy", delta: 0.08, description: "You rejected the curated feed entirely." },
              { axis: "tempo", delta: -0.06, description: "You chose presence over information." },
            ],
          },
        ],
      },
      {
        id: "z1-scroll",
        zoneId: 1,
        position: 3,
        context:
          "Sunday night. You're in bed, scrolling. The app shows you content it has predicted you'll engage with — a mix of what you've liked and what's trending among people the system considers similar to you. You notice thirty minutes have passed. The feed has no bottom.",
        systemFraming: "Your feed continues:",
        choices: [
          {
            id: "z1e3-continue",
            label: "Keep scrolling — there's one more interesting thread",
            subtext: "The feed adjusts in real time to what holds your attention.",
            driftVectors: [
              { axis: "autonomy", delta: -0.12, description: "You followed the feed's pull without deciding to." },
              { axis: "tempo", delta: 0.06, description: "You consumed rapidly, without pause." },
              { axis: "novelty", delta: -0.05, description: "The content confirmed what you already think." },
            ],
          },
          {
            id: "z1e3-book",
            label: "Put the phone down and pick up a book",
            subtext: "It's been on your nightstand for two weeks.",
            driftVectors: [
              { axis: "autonomy", delta: 0.1, description: "You broke the loop deliberately." },
              { axis: "tempo", delta: -0.1, description: "You chose slowness and depth." },
              { axis: "affect", delta: 0.06, description: "The book asks more of you emotionally." },
            ],
          },
          {
            id: "z1e3-sleep",
            label: "Set the phone to Do Not Disturb and go to sleep",
            subtext: "Tomorrow is Monday again.",
            driftVectors: [
              { axis: "autonomy", delta: 0.06, description: "You ended the session on your terms." },
              { axis: "tempo", delta: -0.06, description: "You chose rest over stimulation." },
            ],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // ZONE 2 — AI COMPANION
  // Theme: The delegation of agency to personal AI
  // ═══════════════════════════════════════════════════════
  {
    id: 2,
    title: "The Companion",
    subtitle: "Delegation of Agency",
    description:
      "Three encounters with AI systems that act on your behalf — composing your words, selecting your meals, choosing your route. Each removes a small friction from your day. Each removal is a small transfer of authorship.",
    epigraph:
      "The hand that lifts the burden also shapes the posture. What you no longer carry, you no longer feel.",
    encounters: [
      {
        id: "z2-reply",
        zoneId: 2,
        position: 1,
        context:
          "A friend you haven't spoken to in months texts you: \"Hey, been thinking about you. How's everything going?\" Before you can respond, your phone displays three suggested replies. Each is calibrated for warmth and brevity. Each would take less than a second to send.",
        systemFraming: "Smart Reply suggests:",
        choices: [
          {
            id: "z2e1-quick",
            label: "\"Good! Really busy lately but can't complain\"",
            subtext: "Suggested reply — optimized for warmth and brevity.",
            driftVectors: [
              { axis: "autonomy", delta: -0.1, description: "You used the AI's words instead of your own." },
              { axis: "tempo", delta: 0.08, description: "You chose speed over thoughtfulness." },
              { axis: "affect", delta: -0.06, description: "The reply was warm but impersonal." },
            ],
          },
          {
            id: "z2e1-type",
            label: "Type out your own reply",
            subtext: "It takes a few minutes. You rewrite it twice.",
            driftVectors: [
              { axis: "autonomy", delta: 0.1, description: "You composed your own response." },
              { axis: "tempo", delta: -0.08, description: "You chose care over convenience." },
              { axis: "affect", delta: 0.1, description: "Your words carried your actual feeling." },
            ],
          },
          {
            id: "z2e1-later",
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
        id: "z2-dinner",
        zoneId: 2,
        position: 2,
        context:
          "Thursday evening. You're deciding what to cook. Your recipe app sends a push notification: \"Based on what's in season and your dietary preferences, try this: Miso-glazed salmon with roasted vegetables.\" You check. You have every ingredient. The steps are already laid out.",
        systemFraming: "Your recipe assistant recommends:",
        choices: [
          {
            id: "z2e2-follow",
            label: "Follow the suggested recipe",
            subtext: "It's tailored to your taste profile. The steps are clear.",
            driftVectors: [
              { axis: "autonomy", delta: -0.08, description: "You cooked what the app told you to." },
              { axis: "tempo", delta: 0.06, description: "The decision was made instantly." },
              { axis: "novelty", delta: 0.04, description: "The recipe was new, even if chosen for you." },
            ],
          },
          {
            id: "z2e2-memory",
            label: "Cook something from memory — no recipe",
            subtext: "That pasta your mother used to make. You know it by feel.",
            driftVectors: [
              { axis: "autonomy", delta: 0.1, description: "You relied on your own knowledge." },
              { axis: "novelty", delta: -0.06, description: "You chose the deeply familiar." },
              { axis: "affect", delta: 0.1, description: "Cooking from memory carried emotional weight." },
            ],
          },
          {
            id: "z2e2-order",
            label: "Order delivery — it's been a long day",
            subtext: "The app already knows your usual order.",
            driftVectors: [
              { axis: "autonomy", delta: -0.12, description: "You defaulted to a pre-learned preference." },
              { axis: "tempo", delta: 0.1, description: "You chose maximum convenience." },
            ],
          },
        ],
      },
      {
        id: "z2-route",
        zoneId: 2,
        position: 3,
        context:
          "Friday afternoon. You're driving to meet a friend across town. Your navigation app recalculates: \"A faster route has been found. Save 8 minutes.\" The faster route takes the highway — straight, featureless, efficient. Your usual route goes through the old neighborhood with the bookstore.",
        systemFraming: "Navigation suggests:",
        choices: [
          {
            id: "z2e3-faster",
            label: "Take the faster route",
            subtext: "Eight minutes saved. Arrival time: 3:12 PM.",
            driftVectors: [
              { axis: "tempo", delta: 0.1, description: "You optimized for speed." },
              { axis: "autonomy", delta: -0.06, description: "You followed the algorithm's route." },
              { axis: "novelty", delta: -0.05, description: "The highway is featureless." },
            ],
          },
          {
            id: "z2e3-scenic",
            label: "Keep your usual route through the neighborhood",
            subtext: "You might stop at the bookstore. You might not.",
            driftVectors: [
              { axis: "autonomy", delta: 0.08, description: "You chose your own path." },
              { axis: "tempo", delta: -0.08, description: "You chose the slower, richer option." },
              { axis: "novelty", delta: 0.04, description: "The neighborhood always has something new." },
            ],
          },
          {
            id: "z2e3-dismiss",
            label: "Turn off navigation and drive from memory",
            subtext: "You know the way. You've always known the way.",
            driftVectors: [
              { axis: "autonomy", delta: 0.12, description: "You navigated without assistance." },
              { axis: "tempo", delta: -0.04, description: "Without optimization, you're slightly slower." },
            ],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════
  // ZONE 3 — POLITICAL INFORMATION ENVIRONMENT
  // Theme: AI-mediated civic understanding
  // ═══════════════════════════════════════════════════════
  {
    id: 3,
    title: "The Commons",
    subtitle: "AI-Mediated Civic Life",
    description:
      "Three encounters with how AI shapes your understanding of public life — what issues reach you, how you evaluate them, and whether you act. The civic self is the self most vulnerable to invisible curation.",
    epigraph:
      "A citizen who encounters only the opinions an algorithm predicts they will share is a citizen who has already voted.",
    encounters: [
      {
        id: "z3-filter",
        zoneId: 3,
        position: 1,
        context:
          "You open your social media feed. A story about a proposed housing policy appears at the top — it aligns closely with views you've expressed before. The algorithm has learned your political orientation over three years of engagement. Beneath the story, a small label reads: \"Suggested based on your interests.\" Below it, buried, is an opposing perspective you would need to scroll deliberately to find.",
        systemFraming: "Your curated political feed presents:",
        choices: [
          {
            id: "z3e1-agree",
            label: "Read the top story — it concerns an issue you care about",
            subtext: "The framing matches your position. The data supports your view.",
            driftVectors: [
              { axis: "autonomy", delta: -0.08, description: "You engaged with the content the algorithm selected." },
              { axis: "novelty", delta: -0.1, description: "You stayed within your ideological comfort zone." },
              { axis: "sociality", delta: 0.04, description: "Your view was reinforced by apparent consensus." },
            ],
          },
          {
            id: "z3e1-oppose",
            label: "Scroll past and find the opposing perspective",
            subtext: "It takes effort. The interface is not designed for this.",
            driftVectors: [
              { axis: "autonomy", delta: 0.08, description: "You actively sought what the algorithm deprioritized." },
              { axis: "novelty", delta: 0.1, description: "You engaged with an unfamiliar position." },
              { axis: "tempo", delta: -0.06, description: "Finding the other view took deliberate effort." },
            ],
          },
          {
            id: "z3e1-disengage",
            label: "Close the app — you'll form your opinion elsewhere",
            subtext: "Not here. Not like this.",
            driftVectors: [
              { axis: "autonomy", delta: 0.1, description: "You refused the curated political frame." },
              { axis: "sociality", delta: -0.06, description: "You withdrew from the public discourse." },
            ],
          },
        ],
      },
      {
        id: "z3-summary",
        zoneId: 3,
        position: 2,
        context:
          "A local election is two weeks away. An AI tool offers to summarize the major policy positions of all candidates — their voting records, public statements, and donor profiles — into a clear, side-by-side comparison. It promises \"comprehensive, balanced analysis.\" Your neighbor mentions she's using it to decide how to vote. \"It saves hours,\" she says. \"And it's less biased than the news.\"",
        systemFraming: "The AI civic assistant offers:",
        choices: [
          {
            id: "z3e2-use",
            label: "Use the AI summary to inform your decision",
            subtext: "It consolidates what would take hours into minutes.",
            driftVectors: [
              { axis: "autonomy", delta: -0.1, description: "Your civic understanding was mediated by an AI synthesis." },
              { axis: "tempo", delta: 0.1, description: "Hours of research compressed into minutes." },
              { axis: "sociality", delta: 0.06, description: "You aligned your method with your neighbor's." },
            ],
          },
          {
            id: "z3e2-research",
            label: "Do your own research from primary sources",
            subtext: "Candidate websites, local paper archives, public records. It takes the evening.",
            driftVectors: [
              { axis: "autonomy", delta: 0.12, description: "You formed your civic understanding independently." },
              { axis: "tempo", delta: -0.12, description: "You invested significant time in direct research." },
              { axis: "novelty", delta: 0.06, description: "Primary sources revealed nuance the summary would compress." },
            ],
          },
          {
            id: "z3e2-skip",
            label: "Decide you'll figure it out at the ballot box",
            subtext: "You've voted before without a guide. You'll manage.",
            driftVectors: [
              { axis: "autonomy", delta: 0.04, description: "You neither delegated nor invested deeply." },
              { axis: "affect", delta: -0.06, description: "Civic engagement was treated as routine rather than serious." },
            ],
          },
        ],
      },
      {
        id: "z3-petition",
        zoneId: 3,
        position: 3,
        context:
          "An AI assistant flags an online petition for you. \"Based on your values and past engagement, you might want to support this.\" The petition concerns digital privacy legislation. It includes a pre-drafted comment written in a tone the system has modeled from your previous posts. The comment sounds like you. It is not you.",
        systemFraming: "Your AI civic assistant recommends:",
        choices: [
          {
            id: "z3e3-sign",
            label: "Sign with the pre-drafted comment",
            subtext: "It captures your position accurately. The words are close enough.",
            driftVectors: [
              { axis: "autonomy", delta: -0.12, description: "Your political voice was AI-generated and deployed." },
              { axis: "tempo", delta: 0.08, description: "Civic action reduced to a single click." },
              { axis: "sociality", delta: 0.06, description: "You added your name to a collective action." },
              { axis: "affect", delta: -0.06, description: "The comment carried no personal weight." },
            ],
          },
          {
            id: "z3e3-rewrite",
            label: "Sign, but delete the draft and write your own comment",
            subtext: "You agree with the cause. The words should be yours.",
            driftVectors: [
              { axis: "autonomy", delta: 0.08, description: "You insisted on your own voice in public." },
              { axis: "tempo", delta: -0.06, description: "Writing your own words took longer." },
              { axis: "affect", delta: 0.08, description: "Your comment carried genuine conviction." },
              { axis: "sociality", delta: 0.04, description: "You participated, on your own terms." },
            ],
          },
          {
            id: "z3e3-ignore",
            label: "Dismiss the recommendation entirely",
            subtext: "You didn't ask to be recruited. The cause may be worthy, but the mechanism isn't.",
            driftVectors: [
              { axis: "autonomy", delta: 0.1, description: "You refused to be mobilized by an algorithm." },
              { axis: "sociality", delta: -0.08, description: "You declined collective action." },
            ],
          },
        ],
      },
    ],
  },
];
