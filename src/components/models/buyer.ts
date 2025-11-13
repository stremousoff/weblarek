import {IBuyer, TFormErrors, TPayment} from "../../types";


export class Buyer {
  protected payment?: TPayment = '';
  protected email?: string = '';
  protected phone?: string = '';
  protected address?: string = '';

  update(date: Partial<IBuyer>): void {
    if (date.payment) this.payment = date.payment;
    if (date.email) this.email = date.email;
    if (date.phone) this.phone = date.phone;
    if (date.address) this.address = date.address;
  }

  validate(): TFormErrors | void {
    const errors: TFormErrors = {};

    if (!this.payment) errors.payment = 'Выберите способ оплаты';
    if (!this.email?.trim()) errors.email = 'Email не может быть пустым';
    if (!this.phone?.trim()) errors.phone = 'Телефон не может быть пустым';
    if (!this.address?.trim()) errors.address = 'Адрес не может быть пустым';

    if (Object.keys(errors).length) return errors;

  }

  clear(): void {
    this.payment = undefined;
    this.email = undefined;
    this.phone = undefined;
    this.address = undefined;
  }
}
