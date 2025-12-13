import {ensureElement} from "../../../utils/utils.ts";
import {IProduct} from "../../../types";
import {CardBase} from "./CardBase.ts";
import {categoryMap} from "../../../utils/constants.ts";
import {IEvents} from "../../base/Events.ts";

export class CardPreview extends CardBase<IProduct> {
  protected cardCategory: HTMLElement;
  protected cardImage: HTMLImageElement;
  protected cardText: HTMLElement;
  protected clickableEl: HTMLElement;

  constructor(container: HTMLElement, private event: IEvents) {
    super(container);

    this.cardCategory = ensureElement<HTMLElement>('.card__category', this.container);
    this.cardTitle = ensureElement<HTMLElement>('.card__title', this.container);
    this.cardImage = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.cardPrice = ensureElement<HTMLElement>('.card__price', this.container);
    this.cardText = ensureElement<HTMLElement>('.card__text', this.container);
    this.clickableEl = ensureElement<HTMLElement>('.card__button', this.container);

    this.clickableEl.addEventListener('click', () => {this.event.emit('cardButton:click')})
  }

  set category(value: string) {
    this.cardCategory.textContent = value;
    this.cardCategory.classList.remove(...Object.values(categoryMap));
    this.cardCategory.classList.add(categoryMap[value as keyof typeof categoryMap]);
  }

  set image(value: string) {
    this.cardImage.src = value;
  }

  set description(value: string) {
    this.cardText.textContent = value;
  }

  set buttonText(value: string) {
    this.clickableEl.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    if (value) {
      this.clickableEl.setAttribute('disabled', 'true');
    } else {
      this.clickableEl.removeAttribute('disabled');
    }
  }
}
