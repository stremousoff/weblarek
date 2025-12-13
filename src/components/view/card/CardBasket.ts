import {ensureElement} from "../../../utils/utils.ts";
import {ICardAction, IProduct} from "../../../types";
import {CardBase} from "./CardBase.ts";

export class CardBasket extends CardBase<IProduct> {

  protected indexItem: HTMLElement;
  protected clickableEl: HTMLButtonElement;

  constructor(container: HTMLElement, private action?: ICardAction) {
    super(container);

    this.indexItem = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.clickableEl = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    if (this.action) this.attachClick(this.action.onClick);
  }

  set index(value: number) {
    this.indexItem.textContent = String(value);
  }
}
