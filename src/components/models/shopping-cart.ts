import { IProduct } from '../../types';
import {IEvents} from "../base/Events.ts";


export class ShoppingCart {
  private _cartItems: IProduct[] = [];

  constructor(private eventBroker: IEvents) {
  }

  getCartItems() : IProduct[] {
    return this._cartItems;
  }

  addToCart(product: IProduct) : void {
    product.price != null
      ? this._cartItems.push(product)
      :   console.log(`Товар ${product} не был добавлен в корзину, отсутствует цена`);
    this.eventBroker.emit('shoppingCart:update');
  }

  removeItemFromCart(product: IProduct) : void {
    this._cartItems= this._cartItems.filter((item) => item.id !== product.id);
    this.eventBroker.emit('shoppingCart:update');
  }

  removeAllItemsFromCart() : void {
    this._cartItems = [];
    this.eventBroker.emit('shoppingCart:update');
  }

  getCartTotalPrice() : number {
    return this._cartItems.reduce((total, item) => total + (item.price || 0), 0);
  }

  getCartTotalQuantity() : number {
    return this._cartItems.length;
  }

  checkItemInCart(id: string) : boolean {
    return this._cartItems.some(item => item.id === id);
  }
}