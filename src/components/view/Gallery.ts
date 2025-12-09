import {Component} from "../base/Component.ts";


export class Gallery extends Component<{cards: HTMLElement[]}> {
  constructor(container: HTMLElement) {
    super(container);
  }

  render(data: {cards: HTMLElement[]}): HTMLElement {
    this.container.innerHTML = '';
    data.cards.forEach(card => this.container.appendChild(card));
    return this.container;
  }
}
