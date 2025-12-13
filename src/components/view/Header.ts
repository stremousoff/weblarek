import {Component} from "../base/Component.ts";
import {ensureElement} from "../../utils/utils.ts";
import {IEvents} from "../base/Events.ts";

type THeaderBasketCounter = {
  counter: number
}

export class Header extends Component<THeaderBasketCounter>{
  private headerBasket: HTMLButtonElement
  private headerBasketCounter: HTMLElement

  constructor(container: HTMLElement, private event: IEvents) {
    super(container)

    this.headerBasket = ensureElement<HTMLButtonElement>('.header__basket', this.container);
    this.headerBasketCounter = ensureElement<HTMLElement>('.header__basket-counter', this.container);

    this.headerBasket.addEventListener('click', () => {this.event.emit('shoppingCart:open')})
  }

  set counter(value: number) {
    this.headerBasketCounter.textContent = String(value)
  }
}