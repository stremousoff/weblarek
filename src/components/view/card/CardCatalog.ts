import {ensureElement} from "../../../utils/utils.ts";
import {ICardAction, IProduct} from "../../../types";
import {CardBase} from "./CardBase.ts";

export class CardCatalog extends CardBase<IProduct> {

  protected _cardCategory: HTMLElement;
  protected _cardImage: HTMLImageElement;
  protected _clickableEl: HTMLElement;

  constructor(container: HTMLElement, private action?: ICardAction) {
    super(container);

    this._cardCategory = ensureElement<HTMLElement>('.card__category', this.container);
    this._cardTitle = ensureElement<HTMLElement>('.card__title', this.container);
    this._cardImage = ensureElement<HTMLImageElement>('.card__image', this.container);
    this._cardPrice = ensureElement<HTMLElement>('.card__price', this.container);
    this._clickableEl = this.container;

    if (this.action) this.attachClick(this.action.onClick);
  }

  set category(value: string) {
    this._cardCategory.textContent = value;
  }

  set image(value: string) {
    this._cardImage.src = `./src/images/${value}`;
  }
}
