import { Component } from "../../base/Component.ts";
import {TFormErrors} from "../../../types";

export abstract class BaseForm extends Component<null> {
  protected formErrors: HTMLElement;
  protected submitButton: HTMLButtonElement;

  protected abstract formErrorsFields: (keyof TFormErrors)[];

  protected constructor(container: HTMLElement) {
    super(container);

    this.formErrors = this.container.querySelector('.form__errors')!;
    this.submitButton = this.container.querySelector('button[type="submit"]')!;
  }

  showErrors(errors: Partial<TFormErrors>): boolean {
    const relevantErrors = this.formErrorsFields.map(f => errors[f]).filter(Boolean);
    this.formErrors.textContent = relevantErrors.length === 1 ? relevantErrors[0]! : '';
    return relevantErrors.length === 0; // true, если ошибок нет
  }


  submitButtonEnable(enabled: boolean) {
    if (this.submitButton) this.submitButton.disabled = !enabled;
  }
}
