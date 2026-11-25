import { assert, assertEquals } from "@std/assert";
import { apply, newGame, RECIPES } from "./mod.ts";
import { TERRAIN_YIELDS } from "./terrain.ts";

Deno.test("crafting spends the inputs and adds the output", () => {
  const recipe = RECIPES[0];
  const state = newGame(121);
  for (const [item, amount] of Object.entries(recipe.inputs)) {
    state.inventory[item] = amount;
  }

  const events = apply(state, { type: "craft", recipe: recipe.output });

  assertEquals(state.inventory, { [recipe.output]: 1 });
  assertEquals(events, [{
    type: "crafted",
    recipe: recipe.output,
    inventory: { [recipe.output]: 1 },
  }]);
});

Deno.test("crafting without enough materials changes nothing and says what is missing", () => {
  const recipe = RECIPES[0];
  const state = newGame(121);
  const snapshot = JSON.parse(JSON.stringify(state));

  const events = apply(state, { type: "craft", recipe: recipe.output });

  assertEquals(state, snapshot);
  assertEquals(events, [{
    type: "craft_failed",
    recipe: recipe.output,
    missing: recipe.inputs,
  }]);
});

Deno.test("every recipe input can be gathered or made", () => {
  const sources = new Set<string>();
  for (const item of Object.values(TERRAIN_YIELDS)) {
    if (item) {
      sources.add(item);
    }
  }
  for (const recipe of RECIPES) {
    sources.add(recipe.output);
  }

  for (const recipe of RECIPES) {
    for (const input of Object.keys(recipe.inputs)) {
      assert(
        sources.has(input),
        `recipe "${recipe.output}" needs "${input}", which nothing provides`,
      );
    }
  }
});

Deno.test("a crafted event keeps its inventory while state moves on", () => {
  const recipe = RECIPES[0];
  const state = newGame(121);
  for (const [item, amount] of Object.entries(recipe.inputs)) {
    state.inventory[item] = amount * 2;
  }

  const keptEvents = apply(state, { type: "craft", recipe: recipe.output });
  apply(state, { type: "craft", recipe: recipe.output });

  assertEquals(state.inventory[recipe.output], 2);

  const expected: Record<string, number> = { [recipe.output]: 1 };
  for (const [item, amount] of Object.entries(recipe.inputs)) {
    expected[item] = amount;
  }
  assertEquals(keptEvents, [{
    type: "crafted",
    recipe: recipe.output,
    inventory: expected,
  }]);
});
