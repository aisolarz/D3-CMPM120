import { assertEquals } from "@std/assert";
import { apply, cellAt } from "./mod.ts";
import { findCell } from "./test_helpers.ts";

Deno.test("gathering on grass collects a fence plank and marks the cell changed", () => {
  const state = findCell("grass");
  const { x, y } = state.player;

  const events = apply(state, { type: "gather" });

  assertEquals(state.inventory["fence plank"], 1);
  assertEquals(cellAt(state, x, y), { terrain: "grass", isGathered: true });
  assertEquals(events, [{
    type: "gathered",
    at: { x, y },
    item: "fence plank",
    inventory: { "fence plank": 1 },
  }]);
});

Deno.test("gathering twice on the same cell gives nothing the second time", () => {
  const state = findCell("bush");
  const { x, y } = state.player;

  apply(state, { type: "gather" });
  const snapshot = JSON.parse(JSON.stringify(state));

  const events = apply(state, { type: "gather" });

  assertEquals(state, snapshot);
  assertEquals(events, [{
    type: "gathered_nothing",
    at: { x, y },
    reason: "already gathered",
  }]);
});

Deno.test("gathering on an oak log yields nothing and leaves state unchanged", () => {
  const state = findCell("oak_log");
  const snapshot = JSON.parse(JSON.stringify(state));
  const { x, y } = state.player;

  const events = apply(state, { type: "gather" });

  assertEquals(state, snapshot);
  assertEquals(events, [{
    type: "gathered_nothing",
    at: { x, y },
    reason: "nothing to gather",
  }]);
});

Deno.test("changed cells and inventory survive JSON round-trip", () => {
  const state = findCell("grass");
  const { x, y } = state.player;

  apply(state, { type: "gather" });
  const restored = JSON.parse(JSON.stringify(state));

  assertEquals(restored.inventory["fence plank"], 1);
  assertEquals(cellAt(restored, x, y).isGathered, true);
  assertEquals(Object.keys(restored.changedCells), [`${x},${y}`]);
});
