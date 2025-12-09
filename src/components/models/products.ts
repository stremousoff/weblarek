import { IProduct } from '../../types';
import {IEvents} from "../base/Events.ts";

export class Products {
  protected _allProducts: IProduct[] = [];
  protected _checkItem: IProduct | null = null;

  private eventBroker: IEvents;

  constructor(eventBroker: IEvents) {
    this.eventBroker = eventBroker;
  }

  setItems(apiProducts: IProduct[]) : void {
    this._allProducts = apiProducts;
    this.eventBroker.emit('products:loaded', this._allProducts);
  }

  getItems() : IProduct[] {
    return this._allProducts;
  }

  getItemById(id: string) : IProduct | undefined {
    return this._allProducts.find((item) => item.id === id);
  }

  setCheckItemById(id: string) : boolean {
    const checkItem = this.getItemById(id);
    if (checkItem) {
      this._checkItem = checkItem;
      this.eventBroker.emit('card:select', checkItem);
      return true;
    }
    return false;
  }

  getCheckItem() : IProduct | null {
    return this._checkItem;
  }
}
