import { type GameEvent, type GameState, terrainAt } from "../core/mod.ts";

function element(id: string): HTMLElement {
  return document.getElementById(id)!;
}

function describe(event: GameEvent): string {
  switch (event.type) {
    case "moved":
      return `moved to ${event.to.x}, ${event.to.y}`;
    case "blocked":
      return `blocked by ${event.terrain} at ${event.toward.x}, ${event.toward.y}`;
    case "gathered":
      return `gathered ${event.item}`;
    case "gathered_nothing":
      return `gathered nothing: ${event.reason}`;
  }
}

// The readout, as ordinary page elements that CSS can style and that assistive
// tools can read. It changes only as events play.
export class Hud {
  private readonly seed: number;
  private readonly gathered = new Set<string>();

  constructor(state: GameState) {
    this.seed = state.seed;
    for (const key of Object.keys(state.changedCells)) {
      this.gathered.add(key);
    }
    this.showPosition(state.player.x, state.player.y);
    this.showInventory(state.inventory);
  }

  show(event: GameEvent) {
    element("live").textContent = describe(event);
    if (event.type === "moved") {
      this.showPosition(event.to.x, event.to.y);
    } else if (event.type === "gathered") {
      this.gathered.add(`${event.at.x},${event.at.y}`);
      this.showPosition(event.at.x, event.at.y);
      this.showInventory(event.inventory);
    }
  }

  private showPosition(x: number, y: number) {
    element("position").textContent = `${x}, ${y}`;
    const terrain = terrainAt(this.seed, x, y);
    const status = this.gathered.has(`${x},${y}`)
      ? `${terrain} (gathered)`
      : terrain;
    element("terrain").textContent = status;
  }

  private showInventory(inventory: Record<string, number>) {
    const list = element("inventory");
    list.textContent = "";
    for (const [name, count] of Object.entries(inventory)) {
      const item = document.createElement("li");
      item.textContent = `${name}: ${count}`;
      list.appendChild(item);
    }
  }
}
