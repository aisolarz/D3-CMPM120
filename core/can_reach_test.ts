import { assertEquals } from "@std/assert";
import { type Recipe, RECIPES } from "./recipes.ts";
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
