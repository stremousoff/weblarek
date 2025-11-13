import {IApi, IApiProducts, TOrder, TOrderResponse} from "../../types";

export class LarekApi {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  private async request<T>(fn: () => Promise<T>, errorMessage: string): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      console.error(errorMessage, error);
      throw error;
    }
  }

  getProducts(): Promise<IApiProducts> {
    return this.request(
      () => this.api.get('/product/'),
      'Ошибка при загрузке товаров:'
    );
  }

  postOrder(data: TOrder): Promise<TOrderResponse> {
    return this.request(
      () => this.api.post('/order/', data),
      'Ошибка при оформлении заказа:'
    );
  }
}
