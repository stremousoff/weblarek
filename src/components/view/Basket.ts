import {Component} from "../base/Component.ts";
import {ensureElement} from "../../utils/utils.ts";
import {IEvents} from "../base/Events.ts";

export class Basket extends Component<null>{
  private basketList: HTMLElement;
  private basketButton: HTMLButtonElement;
  private basketPrice: HTMLElement;

  constructor(container: HTMLElement, private events: IEvents) {
    super(container);

    this.basketList = ensureElement<HTMLElement>('.basket__list', this.container);
    this.basketButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
    this.basketPrice = ensureElement<HTMLElement>('.basket__price', this.container);

    this.basketButton.addEventListener('click', () => {
      this.events.emit('order:set')
    })
  }

  set totalPrice(value: number) {
    this.basketPrice.textContent = `${String(value)} синапсов`
  }

  set buttonOrder(enabled: boolean) {
    if (enabled) {
      this.basketButton.removeAttribute('disabled');
    } else {
      this.basketButton.setAttribute('disabled', 'true');
    }
  }

  set renderedCards(cards: HTMLElement[]) {
    this.basketList.innerHTML = '';
    this.basketList.append(...cards)
  }
}