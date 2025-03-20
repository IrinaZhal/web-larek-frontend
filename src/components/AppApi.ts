import { IApi, ICard, IOrder, IOrderResult } from "../types";
import { Api, ApiListResponse } from "./base/api";

export interface IAppApi {
  getCards: () => Promise<ICard[]>;
  getCard: (id: string) => Promise<ICard>;
  postOrder: (order: IOrder) => Promise<IOrderResult>;
}

export class AppApi extends Api implements IAppApi {
  readonly cdn: string;

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
      super(baseUrl, options);
      this.cdn = cdn;
  }

getCard(id: string): Promise<ICard> {
    return this.get(`/product/${id}`).then(
        (item: ICard) => ({
            ...item,
            image: this.cdn + item.image,
        })
    );
}

getCards(): Promise<ICard[]> {
  return this.get('/product').then((data: ApiListResponse<ICard>) =>
      data.items.map((item) => ({
          ...item,
          image: this.cdn + item.image
      }))
  );
}

  //TODO postOrder?
postOrder(order: IOrder): Promise<IOrderResult> {
        return this.post('/order', order).then(
            (data: IOrderResult) => data
        );
    }
}