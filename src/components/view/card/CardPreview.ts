import {ensureElement} from "../../../utils/utils.ts";
import {ICardAction, IProduct} from "../../../types";
import {CardBase} from "./CardBase.ts";
import {categoryMap} from "../../../utils/constants.ts";

export class CardPreview extends CardBase<IProduct> {
  protected _cardCategory: HTMLElement;
  protected _cardImage: HTMLImageElement;
  protected _cardText: HTMLElement;
  protected _clickableEl: HTMLElement;

  constructor(container: HTMLElement, private action?: ICardAction) {
    super(container);

    this._cardCategory = ensureElement<HTMLElement>('.card__category', this.container);
    this._cardTitle = ensureElement<HTMLElement>('.card__title', this.container);
    this._cardImage = ensureElement<HTMLImageElement>('.card__image', this.container);
    this._cardPrice = ensureElement<HTMLElement>('.card__price', this.container);
    this._cardText = ensureElement<HTMLElement>('.card__text', this.container);
    this._clickableEl = ensureElement<HTMLElement>('.card__button', this.container);

    if (this.action) this.attachClick(this.action.onClick);
  }

  set category(value: string) {
    this._cardCategory.textContent = value;
    this._cardCategory.classList.remove(...Object.values(categoryMap));
    this._cardCategory.classList.add(categoryMap[value as keyof typeof categoryMap]);
  }

  set image(value: string) {
    this._cardImage.src = `./src/images/${value}`;
  }

  set price(value: number | null) {
    if (value === null) {
      this._clickableEl.setAttribute('disabled', 'true');
      this._clickableEl.textContent = 'Недоступно';
    } else {
      this._clickableEl.removeAttribute('disabled');
    }
    this._cardPrice.textContent = value ? `${value} синапсов` : 'Бесценно';
  }

  set inCart(value: boolean) {
    if (value) {
      this._clickableEl.textContent = "Удалить из корзины";
    } else {
      this._clickableEl.textContent = "Купить";
    }
  }
}
