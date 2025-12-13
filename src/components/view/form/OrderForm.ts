import { ensureAllElements, ensureElement } from "../../../utils/utils.ts";
import { IEvents } from "../../base/Events.ts";
import {TFormErrors, TPayment} from "../../../types";
import { BaseForm } from "./BaseForm.ts";

export class OrderForm extends BaseForm {
  private paymentButtons: HTMLButtonElement[];
  private addressInput: HTMLInputElement;

  protected formErrorsFields: (keyof TFormErrors)[] = ['payment', 'address'];

  constructor(container: HTMLElement, private event: IEvents) {
    super(container);

    this.paymentButtons = ensureAllElements<HTMLButtonElement>('.button_alt', this.container);
    this.addressInput = ensureElement<HTMLInputElement>('.form__input', this.container);

    this.paymentButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const currentActive = this.paymentButtons.find(b => b.classList.contains('button_alt-active'));

        if (currentActive === btn) {
          btn.classList.remove('button_alt-active');
          this.event.emit('order:update', { payment: undefined });
        } else {
          this.paymentButtons.forEach(b => b.classList.remove('button_alt-active'));
          btn.classList.add('button_alt-active');
          this.event.emit('order:update', { payment: btn.name as TPayment });
        }
      });
    });

    this.addressInput.addEventListener('input', () => {
      this.event.emit('order:update', { address: this.addressInput.value });
    });

    this.container.addEventListener('submit', evt => {
      evt.preventDefault();
      this.event.emit('contacts:set');
    });
  }

  setPaymentButtonActive(payment: TPayment) {
    this.paymentButtons.forEach(btn => btn.classList.remove('button_alt-active'));
    const activeBtn = this.paymentButtons.find(btn => btn.name === payment);
    if (activeBtn) activeBtn.classList.add('button_alt-active');
  }

  setAddress(value: string) {
    this.addressInput.value = value;
  }
}
