import {Component} from "../base/Component.ts";
import {ensureElement} from "../../utils/utils.ts";
import {IEvents} from "../base/Events.ts";

export interface ISuccess {
  orderSuccessDescription: number
}

export class Success extends Component<ISuccess> {
  private _orderSuccessDescription: HTMLElement;
  private _orderSuccessClose: HTMLButtonElement;

  constructor(container: HTMLElement, private event: IEvents) {
    super(container);
    this._orderSuccessDescription = ensureElement<HTMLElement>('.order-success__description', this.container)
    this._orderSuccessClose = ensureElement<HTMLButtonElement>('.order-success__close', this.container)

    this._orderSuccessClose.addEventListener('click', () => {
      this.event.emit('success:close');
    });
  }

  set orderSuccessDescription(value: number) {
    this._orderSuccessDescription.textContent = `Списано ${String(value)} синапсов`
  }
}