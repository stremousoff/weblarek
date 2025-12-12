import {Component} from "../base/Component.ts";
import {ensureElement} from "../../utils/utils.ts";
import {IEvents} from "../base/Events.ts";

export class Basket extends Component<any>{
  private _basketList: HTMLElement;
  private _basketButton: HTMLButtonElement;
  private _basketPrice: HTMLElement;

  constructor(container: HTMLElement, private events: IEvents) {
    super(container);

    this._basketList = ensureElement<HTMLElement>('.basket__list', this.container);
    this._basketButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);
    this._basketPrice = ensureElement<HTMLElement>('.basket__price', this.container);

    this._basketButton.addEventListener('click', () => {
      this.events.emit('order:set')
    })
  }

  set basketPrice(value: number) {
    this._basketPrice.textContent = `${String(value)} синапсов`
  }

  set buttonOrder(enabled: boolean) {
    if (enabled) {
      this._basketButton.removeAttribute('disabled');
    } else {
      this._basketButton.setAttribute('disabled', 'true');
    }
  }

  setCards(cards: HTMLElement[]) {
    this._basketList.innerHTML = '';
    this._basketList.append(...cards)
  }
}