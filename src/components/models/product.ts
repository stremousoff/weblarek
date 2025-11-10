import { IProduct } from '../../types';

export class Product implements IProduct {
  readonly id: string;
  readonly description: string;
  readonly image: string;
  readonly title: string;
  readonly category: string;
  readonly price: number | null;

  constructor(data: IProduct) {
    this.id = data.id;
    this.description = data.description;
    this.image = data.image;
    this.title = data.title;
    this.category = data.category;
    this.price = data.price;
  }
}
