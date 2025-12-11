import { Component } from "../../base/Component.ts";
import {TFormErrors} from "../../../types";

export abstract class BaseForm extends Component<null> {
  protected _formErrors!: HTMLElement;
  protected _submitButton!: HTMLButtonElement;

  protected constructor(container: HTMLElement) {
    super(container);

    this._formErrors = this.container.querySelector('.form__errors')!;
    this._submitButton = this.container.querySelector('button[type="submit"]')!;
  }

  showErrors(errors: TFormErrors) {
    if (this._formErrors)  this._formErrors.textContent =
      errors.address ||
      errors.payment ||
      errors.email ||
      errors.phone ||
      '';
  }

  submitButton(enabled: boolean) {
    if (this._submitButton) this._submitButton.disabled = !enabled;
  }

}
