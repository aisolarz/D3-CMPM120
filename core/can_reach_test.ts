import { assertEquals } from "@std/assert";
import { CAPSTONE, type Recipe, RECIPES } from "./recipes.ts";
import { unreachableRecipes } from "./can_reach.ts";

Deno.test("every recipe in the real table can be made", () => {
  assertEquals(unreachableRecipes(RECIPES), []);
});

Deno.test("a recipe that needs its own output is reported as unreachable", () => {
  const broken: Recipe = {
    output: "sunstone",
    inputs: { "sunstone": 1, "fence plank": 1 },
  };

  const left = unreachableRecipes([...RECIPES, broken]);

  const outputs: string[] = [];
  for (const recipe of left) {
    outputs.push(recipe.output);
  }
  assertEquals(outputs, ["sunstone"]);
});

Deno.test("the capstone is in the table and can be reached", () => {
  let isInTable = false;
  for (const recipe of RECIPES) {
    if (recipe.output === CAPSTONE) {
      isInTable = true;
    }
  }
  assertEquals(isInTable, true);

  for (const recipe of unreachableRecipes(RECIPES)) {
    assertEquals(recipe.output === CAPSTONE, false);
  }
});
