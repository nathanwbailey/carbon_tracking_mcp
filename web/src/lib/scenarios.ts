import type { Tokens } from "./energy";

export type Scenario = { id: string; label: string; description: string; tokens: Tokens };

// Illustrative assumptions, not measurements.
export const SCENARIOS: Scenario[] = [
  {
    id: "chat",
    label: "One chat prompt",
    description: "A single short question and answer.",
    tokens: { input: 2_000, output: 500, cacheRead: 0, cacheWrite: 0 },
  },
  {
    id: "dev-day",
    label: "One developer, one day",
    description: "About 100 agent requests in a long, cache-heavy coding session.",
    tokens: { input: 300_000, output: 60_000, cacheRead: 15_000_000, cacheWrite: 1_000_000 },
  },
  {
    id: "team-year",
    label: "50 developers, one year",
    description: "The developer day above, times 50 developers and 250 working days.",
    tokens: { input: 3_750_000_000, output: 750_000_000, cacheRead: 187_500_000_000, cacheWrite: 12_500_000_000 },
  },
  {
    id: "support-bot",
    label: "Support chatbot, one year",
    description: "100,000 conversations a month at about 3,000 input and 600 output tokens each.",
    tokens: { input: 3_600_000_000, output: 720_000_000, cacheRead: 0, cacheWrite: 0 },
  },
];
