import {Component} from "../base/Component.ts";


export class Gallery extends Component<{cards: HTMLElement[]}> {
  constructor(container: HTMLElement) {
    super(container);
  }

  set renderedCards(cards: HTMLElement[]) {
    this.container.innerHTML = '';
    this.container.append(...cards)
  }
}
