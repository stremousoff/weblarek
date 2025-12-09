import { Component } from "../../base/Component.ts";
import { ensureAllElements, ensureElement } from "../../../utils/utils.ts";
import { IEvents } from "../../base/Events.ts";
import { TFormErrors, TPayment } from "../../../types";

export class Order extends Component<null> {
  private _paymentButtons: HTMLButtonElement[];
  private _addressInput: HTMLInputElement;
  private _formErrors: HTMLElement;
  private _submitButton: HTMLButtonElement;

  constructor(container: HTMLElement, private event: IEvents) {
    super(container);

    this._paymentButtons = ensureAllElements<HTMLButtonElement>('.button_alt', this.container);
    this._addressInput = ensureElement<HTMLInputElement>('.form__input', this.container);
    this._formErrors = ensureElement<HTMLElement>('.form__errors', this.container);
    this._submitButton = ensureElement<HTMLButtonElement>('.order__button', this.container);

    this._paymentButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.event.emit('order:update', { payment: btn.name as TPayment });
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

  showErrors(errors: TFormErrors) {
    this._formErrors.textContent = errors.address || errors.payment || '';
  }

  submitButton(enabled: boolean) {
    this._submitButton.disabled = !enabled;
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
