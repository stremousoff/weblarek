import {Component} from "../../base/Component.ts";
import {ensureElement} from "../../../utils/utils.ts";
import {IProduct} from "../../../types";

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


export class CardBasket extends Component<IProduct> {

  protected _cardTitle: HTMLElement;
  protected _cardPrice: HTMLElement;
  protected _indexItem: HTMLElement;
  protected _basketItemDeleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, private action: ICardAction) {
    super(container);

    this._cardTitle = ensureElement<HTMLElement>('.card__title', this.container);
    this._cardPrice = ensureElement<HTMLElement>('.card__price', this.container);
    this._indexItem = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this._basketItemDeleteButton = ensureElement<HTMLButtonElement>('.basket__item-delete', this.container);

    if (this.action.onClick) {
      this._basketItemDeleteButton.addEventListener('click', () => this.action.onClick())
    }
  }

  set title(value: string) {
    this._cardTitle.textContent = value;
  }

  set price(value: number) {
    this._cardPrice.textContent = `${value} синапсов`;
  }

  set index(value: number) {
    this._indexItem.textContent = String(value);
  }
}