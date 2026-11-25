import {
  type GameState,
  isPassable,
  newGame,
  type Terrain,
  terrainAt,
} from "./mod.ts";

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

// an open cell with the given barrier terrain directly to its east.
export function findBesideBarrier(
  terrain: Terrain,
  seed: number = TEST_SEED,
): GameState {
  for (let y = 0; y < 100; y++) {
    for (let x = 0; x < 99; x++) {
      const here = terrainAt(seed, x, y);
      const east = terrainAt(seed, x + 1, y);
      if (isPassable(here, {}) && east === terrain) {
        return { ...newGame(seed), player: { x, y } };
      }
    }
  }
  throw new Error(`Found no open cell beside ${terrain}`);
}
