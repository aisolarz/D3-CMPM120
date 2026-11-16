import { type GameState, newGame, type Terrain, terrainAt } from "./mod.ts";

export const TEST_SEED = 121;

export function findCell(
  terrain: Terrain,
  seed: number = TEST_SEED,
): GameState {
  for (let y = 0; y < 100; y++) {
    for (let x = 0; x < 100; x++) {
      if (terrainAt(seed, x, y) === terrain) {
        return { ...newGame(seed), player: { x, y } };
      }
    }
  }
  throw new Error(`Found no cell with terrain: ${terrain}`);
}
