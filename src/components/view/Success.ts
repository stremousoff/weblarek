import {Component} from "../base/Component.ts";
import {ensureElement} from "../../utils/utils.ts";
import {IEvents} from "../base/Events.ts";

export interface ISuccess {
  orderSuccessDescription: number
}

export class Success extends Component<ISuccess> {
  private orderSuccessDescription: HTMLElement;
  private orderSuccessClose: HTMLButtonElement;

  constructor(container: HTMLElement, private event: IEvents) {
    super(container);
    this.orderSuccessDescription = ensureElement<HTMLElement>('.order-success__description', this.container)
    this.orderSuccessClose = ensureElement<HTMLButtonElement>('.order-success__close', this.container)

    this.orderSuccessClose.addEventListener('click', () => {
      this.event.emit('success:close');
    });
  }

  set orderSuccessMessage(value: number) {
    this.orderSuccessDescription.textContent = `Списано ${String(value)} синапсов`
  }
}