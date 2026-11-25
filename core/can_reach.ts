import type { Recipe } from "./recipes.ts";
import { BARRIER_OPENERS, type Terrain, TERRAIN_YIELDS } from "./terrain.ts";

export function unreachableRecipes(recipes: Recipe[]): Recipe[] {
  const terrains = Object.keys(TERRAIN_YIELDS) as Terrain[];
  const reached = new Set<string>();
  const made = new Set<Recipe>();

  let changed = true;
  while (changed) {
    changed = false;

    // A terrain can be gathered from if it has no opener, or its opener is reached.
    for (const terrain of terrains) {
      const opener = BARRIER_OPENERS[terrain];
      const isOpen = opener === undefined || reached.has(opener);
      const item = TERRAIN_YIELDS[terrain];
      if (isOpen && item && !reached.has(item)) {
        reached.add(item);
        changed = true;
      }
    }

    // A recipe can be made if everything it needs is reached.
    for (const recipe of recipes) {
      if (made.has(recipe)) {
        continue;
      }
      let isReady = true;
      for (const input of Object.keys(recipe.inputs)) {
        if (!reached.has(input)) {
          isReady = false;
        }
      }
      if (isReady) {
        made.add(recipe);
        reached.add(recipe.output);
        changed = true;
      }
    }
  }

  const left: Recipe[] = [];
  for (const recipe of recipes) {
    if (!made.has(recipe)) {
      left.push(recipe);
    }
  }
  return left;
}
