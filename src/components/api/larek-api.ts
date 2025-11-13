import {IApi, IApiProducts, TOrder, TOrderResponse} from "../../types";


export class LarekApi {
  private api: IApi

  constructor(api: IApi) {
    this.api = api
  }
  async get() : Promise<IApiProducts> {
    return this.api.get('/product/')
  }

  async post(data: TOrder) : Promise<TOrderResponse> {
    return this.api.post('/order/', data)
  }
}