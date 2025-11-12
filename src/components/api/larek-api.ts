import {IApi, IApiProducts, TOrder, TOrderResponse} from "../../types";


export class LarekApi {
  private api: IApi

  constructor(api: IApi) {
    this.api = api
  }
  async get(url: string = '/product/') : Promise<IApiProducts> {
    return this.api.get(url)
  }

  async post(data: TOrder, url: string = '/order/') : Promise<TOrderResponse> {
    return this.api.post(url, data)
  }
}