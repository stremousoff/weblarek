import { IProduct } from '../../types';


export class ShoppingCart {
  private _cartItems: IProduct[] = [];

  getCartItems() : IProduct[] {
    return this._cartItems;
  }

  addToCart(product: IProduct) : void {
    product.price != null
      ? this._cartItems.push(product)
      : console.log(`Товар ${product} не был добавлен в корзину, отсутствует цена`);
  }

  removeItemFromCart(product: IProduct) : void {
    this._cartItems= this._cartItems.filter((item) => item.id !== product.id);
  }

  removeAllItemsFromCart() : void {
    this._cartItems = [];
  }

  getCartTotalPrice() : number {
    return this._cartItems.reduce((total, item) => total + (item.price || 0), 0);
  }

  getCartTotalQuantity() : number {
    return this._cartItems.length;
  }

  checkItemInCart(id: string) : boolean {
    return !this._cartItems.some(item => item.id === id);
  }
}