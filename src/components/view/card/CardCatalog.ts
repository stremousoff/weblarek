import {ensureElement} from "../../../utils/utils.ts";
import {ICardAction, IProduct} from "../../../types";
import {CardBase} from "./CardBase.ts";
import {categoryMap} from "../../../utils/constants.ts";

export class CardCatalog extends CardBase<IProduct> {

  protected cardCategory: HTMLElement;
  protected cardImage: HTMLImageElement;
  protected clickableEl: HTMLElement;

  constructor(container: HTMLElement, private action?: ICardAction) {
    super(container);

    this.cardCategory = ensureElement<HTMLElement>('.card__category', this.container);
    this.cardTitle = ensureElement<HTMLElement>('.card__title', this.container);
    this.cardImage = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.clickableEl = this.container;

    if (this.action) this.attachClick(this.action.onClick);
  }

  set category(value: string) {
    this.cardCategory.textContent = value;
    this.cardCategory.classList.remove(...Object.values(categoryMap));
    this.cardCategory.classList.add(categoryMap[value as keyof typeof categoryMap]);
    }

  set image(value: string) {
    this.cardImage.src = value;
  }
}
