import { IProduct } from '../../types';
import {IEvents} from "../base/Events.ts";
import {CDN_URL} from "../../utils/constants.ts";

export class Products {
  protected allProducts: IProduct[] = [];
  protected checkItem: IProduct | null = null;

  private eventBroker: IEvents;

  constructor(eventBroker: IEvents) {
    this.eventBroker = eventBroker;
  }

  setItems(apiProducts: IProduct[]) : void {
    this.allProducts = apiProducts.map(product => {
        product.image = CDN_URL + product.image.replace('.svg', '.png')
        return product
    });
    this.eventBroker.emit('products:loaded');
  }

  getItems() : IProduct[] {
    return this.allProducts;
  }

  getItemById(id: string) : IProduct | undefined {
    return this.allProducts.find((item) => item.id === id);
  }

  setCheckItemById(id: string) : boolean {
    const checkItem = this.getItemById(id);
    if (checkItem) {
      this.checkItem = checkItem;
      this.eventBroker.emit('card:loaded');
      return true;
    }
    return false;
  }

  getCheckItem() : IProduct | null {
    return this.checkItem;
  }
}
