import {
  type Command,
  type GameState,
  missingFor,
  RECIPES,
} from "../core/mod.ts";

// The recipe list on the page. It shows buttons and decides nothing. the core
// says what is missing and a click only sends a craft command.
export class RecipeBook {
  private readonly state: GameState;
  private readonly buttons: HTMLButtonElement[] = [];

  constructor(
    list: HTMLElement,
    state: GameState,
    sendCommand: (command: Command) => void,
  ) {
    this.state = state;
    for (const recipe of RECIPES) {
      const item = document.createElement("li");
      const button = document.createElement("button");
      button.type = "button";
      button.addEventListener("click", (event) => {
        sendCommand({ type: "craft", recipe: recipe.output });
        // after one mouse click give the keys back to the game
        if (event.detail > 0) button.blur();
      });
      item.appendChild(button);
      list.appendChild(item);
      this.buttons.push(button);
    }
    this.update();
  }

  // change the buttons. never rebuild them so keyboard focus is not lost
  update() {
    for (let i = 0; i < RECIPES.length; i++) {
      const recipe = RECIPES[i];
      const missing = missingFor(this.state, recipe);
      const parts: string[] = [];
      for (const [item, amount] of Object.entries(missing)) {
        parts.push(`${amount} ${item}`);
      }
      if (parts.length === 0) {
        this.buttons[i].textContent = `${recipe.output} (ready)`;
      } else {
        this.buttons[i].textContent = `${recipe.output} (need ${
          parts.join(", ")
        })`;
      }
    }
  }
}
