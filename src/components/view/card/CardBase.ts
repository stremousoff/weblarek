import {Component} from "../../base/Component.ts";
import {IProduct} from "../../../types";
import {ensureElement} from "../../../utils/utils.ts";

export abstract class CardBase<T extends IProduct> extends Component<T>{
  protected _cardTitle: HTMLElement;
  protected _cardPrice: HTMLElement;

  protected abstract _clickableEl: HTMLElement;

  protected constructor(container: HTMLElement) {
    super(container);

    this._cardTitle = ensureElement<HTMLElement>('.card__title', this.container);
    this._cardPrice = ensureElement<HTMLElement>('.card__price', this.container);
  }

  protected attachClick (handler: () => void) {
    if (this._clickableEl) {
      this._clickableEl.addEventListener('click', handler);
    }
  }

  set title(value: string) {
    this._cardTitle.textContent = value;
  }

  set price(value: number | null) {
    this._cardPrice.textContent = `${value} синапсов`;
  }
}
