import {IBuyer, TFormErrors, TPayment} from "../../types";


export class Buyer implements IBuyer {
  protected _payment?: TPayment;
  protected _email?: string;
  protected _phone?: string;
  protected _address?: string;

  update(date: Partial<IBuyer>): void {
    if (date.payment) this._payment = date.payment;
    if (date.email) this._email = date.email;
    if (date.phone) this._phone = date.phone;
    if (date.address) this._address = date.address;
  }
  set payment(value: TPayment) {
    this._payment = value;
  }
  set email(value: string) {
    this._email = value;
  }
  set phone(value: string) {
    this._phone = value;
  }
  set address(value: string) {
    this._address = value;
  }

  validate(): TFormErrors | void {
    const errors: TFormErrors = {};

    if (!this._payment) errors.payment = 'Выберите способ оплаты';
    if (!this._email?.trim()) errors.email = 'Email не может быть пустым';
    if (!this._phone?.trim()) errors.phone = 'Телефон не может быть пустым';
    if (!this._address?.trim()) errors.address = 'Адрес не может быть пустым';

    if (errors) return errors;

    console.log('Объект покупателя валиден:', {
      payment: this._payment,
      email: this._email,
      phone: this._phone,
      address: this._address
    });
  }

  clear(): void {
    this._payment = undefined;
    this._email = undefined;
    this._phone = undefined;
    this._address = undefined;

    console.log('Объект покупателя очищен:', {
      payment: this._payment,
      email: this._email,
      phone: this._phone,
      address: this._address
    });
  }
}
