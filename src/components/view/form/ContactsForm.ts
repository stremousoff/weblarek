import { ensureElement } from "../../../utils/utils.ts";
import { IEvents } from "../../base/Events.ts";
import { BaseForm } from "./BaseForm.ts";
import {TFormErrors} from "../../../types";

export class ContactsForm extends BaseForm {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;

  protected formErrorsFields: (keyof TFormErrors)[] = ['email', 'phone'];

  constructor(container: HTMLElement, private event: IEvents) {
    super(container);

    this.emailInput = ensureElement<HTMLInputElement>('[name="email"]', this.container);
    this.phoneInput = ensureElement<HTMLInputElement>('[name="phone"]', this.container);

    this.container.addEventListener('submit', evt => {
      evt.preventDefault();
      this.event.emit('success:show');
    });

    this.emailInput.addEventListener('input', () => {
      this.event.emit('contacts:update', { email: this.emailInput.value });
    });

    this.phoneInput.addEventListener('input', () => {
      this.event.emit('contacts:update', { phone: this.phoneInput.value });
    });
  }

  setEmail(value: string) {
    this.emailInput.value = value;
  }

  setPhone(value: string) {
    this.phoneInput.value = value;
  }
}
