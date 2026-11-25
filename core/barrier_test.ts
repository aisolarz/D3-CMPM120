import { assertEquals } from "@std/assert";
import { apply } from "./mod.ts";
import { findBesideBarrier } from "./test_helpers.ts";

Deno.test("mud is shut until the player holds wooden stepping stones", () => {
  const state = findBesideBarrier("mud");
  const start = { ...state.player };

  const shut = apply(state, { type: "move", direction: "east" });
  assertEquals(shut[0].type, "blocked");
  assertEquals(state.player, start);

  state.inventory["wooden stepping stones"] = 1;
  const open = apply(state, { type: "move", direction: "east" });
  assertEquals(open[0].type, "moved");
  assertEquals(state.player, { x: start.x + 1, y: start.y });
});

Deno.test("gathering works on mud once the player is standing in it", () => {
  const state = findBesideBarrier("mud");
  state.inventory["wooden stepping stones"] = 1;
  apply(state, { type: "move", direction: "east" });

  const events = apply(state, { type: "gather" });

  assertEquals(events[0].type, "gathered");
  assertEquals(state.inventory["cardboard box"], 1);
});

Deno.test("an oak log is shut until the player holds a cardboard ramp", () => {
  const state = findBesideBarrier("oak_log");
  const start = { ...state.player };

  const shut = apply(state, { type: "move", direction: "east" });
  assertEquals(shut[0].type, "blocked");
  assertEquals(state.player, start);

  state.inventory["cardboard ramp"] = 1;
  const open = apply(state, { type: "move", direction: "east" });
  assertEquals(open[0].type, "moved");
  assertEquals(state.player, { x: start.x + 1, y: start.y });
});
