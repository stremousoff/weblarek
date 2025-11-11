import { Product } from './product';
import { IApiProducts } from '../../types';

export class Products {
  protected _allProducts: Product[] = [];
  protected _checkItem: Product | null = null;

  setItems(apiProducts: IApiProducts) : void {
    this._allProducts = apiProducts.items.map((item) => new Product(item));
  }

  getItems() : Product[] {
    return this._allProducts;
  }

  getItemById(id: string) : Product | undefined {
    return this._allProducts.find((item) => item.id === id);
  }

  setCheckItemById(id: string) : boolean {
    const checkItem = this._allProducts.find((item) => item.id === id);
    if (checkItem) {
      this._checkItem = checkItem;
      return true;
    }
    return false;
  }

  deleteCheckItem() : boolean {
    if (this._checkItem) {
      this._checkItem = null;
      return true;
    }
    return false;
  }
}
