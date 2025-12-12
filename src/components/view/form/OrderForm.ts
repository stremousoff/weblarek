import { ensureAllElements, ensureElement } from "../../../utils/utils.ts";
import { IEvents } from "../../base/Events.ts";
import {TFormErrors, TPayment} from "../../../types";
import { BaseForm } from "./BaseForm.ts";

export class OrderForm extends BaseForm {
  private _paymentButtons: HTMLButtonElement[];
  private _addressInput: HTMLInputElement;

  protected _formErrorsFields: (keyof TFormErrors)[] = ['payment', 'address'];

  constructor(container: HTMLElement, private event: IEvents) {
    super(container);

    this._paymentButtons = ensureAllElements<HTMLButtonElement>('.button_alt', this.container);
    this._addressInput = ensureElement<HTMLInputElement>('.form__input', this.container);

    this._paymentButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const currentActive = this._paymentButtons.find(b => b.classList.contains('button_alt-active'));

        if (currentActive === btn) {
          btn.classList.remove('button_alt-active');
          this.event.emit('order:update', { payment: undefined });
        } else {
          this._paymentButtons.forEach(b => b.classList.remove('button_alt-active'));
          btn.classList.add('button_alt-active');
          this.event.emit('order:update', { payment: btn.name as TPayment });
        }
      });
    });

    this._addressInput.addEventListener('input', () => {
      this.event.emit('order:update', { address: this._addressInput.value });
    });

    this.container.addEventListener('submit', evt => {
      evt.preventDefault();
      this.event.emit('contacts:set');
    });
  }

  setPaymentButtonActive(payment: TPayment) {
    this._paymentButtons.forEach(btn => btn.classList.remove('button_alt-active'));
    const activeBtn = this._paymentButtons.find(btn => btn.name === payment);
    if (activeBtn) activeBtn.classList.add('button_alt-active');
  }

  setAddress(value: string) {
    this._addressInput.value = value;
  }
}
