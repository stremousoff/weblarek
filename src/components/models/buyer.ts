import {IBuyer, TFormErrors, TPayment} from "../../types";
import {IEvents} from "../base/Events.ts";

export class Buyer {
  protected payment?: TPayment = '';
  protected email?: string = '';
  protected phone?: string = '';
  protected address?: string = '';

  constructor(private events: IEvents) {
  }

  update(data: Partial<IBuyer>) {
    Object.assign(this, data);
    this.events.emit('buyer:update');
  }

  validate(): TFormErrors {
    const errors: TFormErrors = {};

    if (!this.payment) errors.payment = 'Необходимо выбрать способ оплаты';
    if (!this.address?.trim()) errors.address = 'Необходимо указать адрес';
    if (!this.email?.trim()) errors.email = 'Необходимо указать email';
    if (!this.phone?.trim()) errors.phone = 'Необходимо указать телефон';

    return errors;
  }

  clear(): void {
    this.payment = undefined;
    this.email = undefined;
    this.phone = undefined;
    this.address = undefined;
  }

  getPayment(): TPayment | undefined { return this.payment; }
  getAddress(): string | undefined { return this.address; }
  getEmail(): string | undefined  { return this.email; }
  getPhone(): string | undefined  { return this.phone; }
}
