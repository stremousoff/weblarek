import { IProduct } from '../../types';

export class Products {
  protected _allProducts: IProduct[] = [];
  protected _checkItem: IProduct | null = null;

  setItems(apiProducts: IProduct[]) : void {
    this._allProducts = apiProducts;
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
      return true;
    }
    return false;
  }

  getCheckItem() : IProduct | null {
    return this._checkItem;
  }
}
