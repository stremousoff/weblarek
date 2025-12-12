import { Component } from "../../base/Component.ts";
import {TFormErrors} from "../../../types";

export abstract class BaseForm extends Component<null> {
  protected _formErrors!: HTMLElement;
  protected _submitButton!: HTMLButtonElement;

  protected abstract _formErrorsFields: (keyof TFormErrors)[];

  protected constructor(container: HTMLElement) {
    super(container);

    this._formErrors = this.container.querySelector('.form__errors')!;
    this._submitButton = this.container.querySelector('button[type="submit"]')!;
  }

  showErrors(errors: Partial<TFormErrors>): boolean {
    const relevantErrors = this._formErrorsFields.map(f => errors[f]).filter(Boolean);
    this._formErrors.textContent = relevantErrors.length === 1 ? relevantErrors[0]! : '';
    return relevantErrors.length === 0; // true, если ошибок нет
  }


  submitButton(enabled: boolean) {
    if (this._submitButton) this._submitButton.disabled = !enabled;
  }
}
