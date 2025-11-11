import { IProduct, IApiProducts } from '../../types';

export class Products {
  protected _allProducts: IProduct[] = [];
  protected _checkItem: IProduct | null = null;

  setItems(apiProducts: IApiProducts) : void {
    this._allProducts = apiProducts.items.map((item) => item);
  }

  getItems() : IProduct[] {
    return this._allProducts;
  }

  getItemById(id: string) : IProduct | undefined {
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

  getCheckItem() : IProduct | null {
    return this._checkItem;
  }
}
