import {IApi, IApiProducts, TOrder, TOrderResponse} from "../../types";


export class LarekApi {
  private api: IApi

  constructor(api: IApi) {
    this.api = api
  }
  async get() : Promise<IApiProducts> {
    const url = '/product/'
    return this.api.get(url)
  }

  async post(data: TOrder) : Promise<TOrderResponse> {
    const url = '/order/'
    return this.api.post(url, data)
  }
}