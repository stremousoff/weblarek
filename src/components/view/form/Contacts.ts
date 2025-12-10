import { Component } from "../../base/Component.ts";
import { ensureElement } from "../../../utils/utils.ts";
import { IEvents } from "../../base/Events.ts";
import { TFormErrors } from "../../../types";

export class Contacts extends Component<null> {
  private _emailInput: HTMLInputElement;
  private _phoneInput: HTMLInputElement;
  private _formErrors: HTMLElement;
  private _submitButton: HTMLButtonElement;

  constructor(container: HTMLElement, private event: IEvents) {
    super(container);

    this._emailInput = ensureElement<HTMLInputElement>('[name="email"]', this.container);
    this._phoneInput = ensureElement<HTMLInputElement>('[name="phone"]', this.container);
    this._formErrors = ensureElement<HTMLElement>('.form__errors', this.container);
    this._submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.container);

    this.container.addEventListener('submit', evt => {
      evt.preventDefault();
      this.event.emit('success:show');
    });

    this._emailInput.addEventListener('input', () => {
      this.event.emit('contacts:update', { email: this._emailInput.value });
    });

    this._phoneInput.addEventListener('input', () => {
      this.event.emit('contacts:update', { phone: this._phoneInput.value });
    });
  }

  showErrors(errors: TFormErrors) {
    this._formErrors.textContent = errors.email || errors.phone || '';
  }

  submitButton(enabled: boolean) {
    this._submitButton.disabled = !enabled;
  }

  setEmail(value: string) {
    this._emailInput.value = value;
  }

  setPhone(value: string) {
    this._phoneInput.value = value;
  }
}
