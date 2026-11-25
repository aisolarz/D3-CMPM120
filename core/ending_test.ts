import { assertEquals } from "@std/assert";
import { apply, CAPSTONE, type Command, newGame, RECIPES } from "./mod.ts";

function gameReadyForCapstone() {
  const state = newGame(121);
  for (const recipe of RECIPES) {
    if (recipe.output === CAPSTONE) {
      for (const [item, amount] of Object.entries(recipe.inputs)) {
        state.inventory[item] = amount;
      }
    }
  }
  return state;
}

Deno.test("crafting the capstone reports the ending and ends the game", () => {
  const state = gameReadyForCapstone();

  const events = apply(state, { type: "craft", recipe: CAPSTONE });

  assertEquals(events[0].type, "crafted");
  assertEquals(events[1].type, "ended");
  assertEquals(state.isOver, true);
});

Deno.test("after the ending, every command does nothing", () => {
  const state = gameReadyForCapstone();
  apply(state, { type: "craft", recipe: CAPSTONE });
  const snapshot = JSON.parse(JSON.stringify(state));

  const commands: Command[] = [
    { type: "move", direction: "north" },
    { type: "move", direction: "south" },
    { type: "move", direction: "east" },
    { type: "move", direction: "west" },
    { type: "gather" },
  ];
  for (const recipe of RECIPES) {
    commands.push({ type: "craft", recipe: recipe.output });
  }

  for (const command of commands) {
    const events = apply(state, command);
    assertEquals(events, []);
    assertEquals(state, snapshot);
  }
});
