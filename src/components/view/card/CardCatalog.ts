import {Component} from "../../base/Component.ts";
import {ensureElement} from "../../../utils/utils.ts";

export interface ICardCatalog {
  id: string;
  category: string;
  title: string;
  image: string;
  price: number | null;
}

interface ICardAction {
  onClick: () => void;
}


export class CardCatalog extends Component<ICardCatalog> {

  protected _cardCategory: HTMLElement;
  protected _cardTitle: HTMLElement;
  protected _cardImage: HTMLImageElement;
  protected _cardPrice: HTMLElement;

  constructor(container: HTMLElement, private action?: ICardAction) {
    super(container);

    this._cardCategory = ensureElement<HTMLElement>('.card__category', this.container);
    this._cardTitle = ensureElement<HTMLElement>('.card__title', this.container);
    this._cardImage = ensureElement<HTMLImageElement>('.card__image', this.container);
    this._cardPrice = ensureElement<HTMLElement>('.card__price', this.container);

    if (this.action?.onClick) {
      this.container.addEventListener('click', this.action.onClick)
    }
  }


  set category(value: string) {
    this._cardCategory.textContent = value;
  }

  set title(value: string) {
    this._cardTitle.textContent = value;
  }

  set image(value: string) {
    this._cardImage.src = `./src/images/${value}`;
  }

  set price(value: number | null) {
    this._cardPrice.textContent = value ?`${value} синапсов` : 'Бесценно';
  }
}