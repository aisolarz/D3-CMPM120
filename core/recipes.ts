//recipe data!
export type Recipe = {
  output: string;
  inputs: Record<string, number>;
};

export const RECIPES: Recipe[] = [
  {
    output: "wooden stepping stones",
    inputs: { "fence plank": 1, "rope": 1 },
  },
  {
    output: "cardboard ramp",
    inputs: { "cardboard box": 1, "fence plank": 1, "rope": 1 },
  },
];
