import { ensureElement } from "../../../utils/utils.ts";
import { IEvents } from "../../base/Events.ts";
import { BaseForm } from "./BaseForm.ts";
import {TFormErrors} from "../../../types";

export class ContactsForm extends BaseForm {
  private _emailInput: HTMLInputElement;
  private _phoneInput: HTMLInputElement;

  protected _formErrorsFields: (keyof TFormErrors)[] = ['email', 'phone'];

  constructor(container: HTMLElement, private event: IEvents) {
    super(container);

    this._emailInput = ensureElement<HTMLInputElement>('[name="email"]', this.container);
    this._phoneInput = ensureElement<HTMLInputElement>('[name="phone"]', this.container);

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

  setEmail(value: string) {
    this._emailInput.value = value;
  }

  setPhone(value: string) {
    this._phoneInput.value = value;
  }
}
