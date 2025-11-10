import {Product} from "./product.ts";


export class ShoppingCart {
  private _cartItems: Product[] = [];

  getCartItems() : Product[] {
    return this._cartItems;
  }

  addToCart(product: Product) : void {
    product.price != null
      ? this._cartItems.push(product)
      : console.log(`Товар ${product} не был добавлен в корзину, отсутствует цена`);
  }

  removeItemFromCart(product: Product) : Product | undefined {
    const removeIndex = this._cartItems.findIndex(item => item.id === product.id);
    const removedItem = this._cartItems[removeIndex];
    this._cartItems.splice(removeIndex, 1);
    return removedItem;
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