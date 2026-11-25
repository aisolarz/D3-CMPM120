import { assert, assertEquals } from "@std/assert";
import { apply, type Command, type GameEvent, newGame } from "./mod.ts";
import run from "./run.json" with { type: "json" };

function replay() {
  const state = newGame(run.seed);
  const events: GameEvent[] = [];
  for (const command of run.commands as Command[]) {
    events.push(...apply(state, command));
  }
  return { state, events };
}

Deno.test("recorded run finishes the game", () => {
  const { state, events } = replay();

  assert(state.isOver);
  assert(events.some((event) => event.type === "ended"));
});

Deno.test("recorded run is deterministic", () => {
  const first = replay();

  const start = Date.now();
  while (Date.now() === start);
  const second = replay();

  assertEquals(first, second);
});
