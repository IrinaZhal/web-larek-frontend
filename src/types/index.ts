import { ApiPostMethods } from "../components/base/api";

export interface ICard {
  id: string;
  description:string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IBasketData {
  items: ICard[];
  total: number;
  
  addItem(item: ICard): void;
  deleteItem(item: ICard): void;
}

//для каталога карточек
export interface ICardsData {
  cards: ICard[];
  preview: string | null; //для превью выбранной карточки
  
  getCard(cardId: string): ICard;
}

export interface IContactForm {
  email: string;
  phone: string;
}

export interface IOrderForm {
  payment: string;
  address: string;
}

//для всей инфы заказа
export interface IOrderData {
  payment: string; 
  address: string;
  email: string;
  phone: string;
}

export interface IOrder extends IOrderData {
  items: string[];
  total: number;
}

export interface IOrderResult {
  id: string | string[];
  total: number;
}


export interface IApi {
  baseUrl: string;
  get<T>(uri: string): Promise<T>;
  post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}