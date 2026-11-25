//recipe data!
export type Recipe = {
  output: string;
  inputs: Record<string, number>;
};

// The recipe that wins the game
export const CAPSTONE = "rope ladder hook";

export const RECIPES: Recipe[] = [
  {
    output: "wooden stepping stones",
    inputs: { "fence plank": 1, "rope": 1 },
  },
  {
    output: "cardboard ramp",
    inputs: { "cardboard box": 1, "fence plank": 1, "rope": 1 },
  },
  {
    output: CAPSTONE,
    inputs: { "grappling hook": 1, "rope": 1 },
  },
];
