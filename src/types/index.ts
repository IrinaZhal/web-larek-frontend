export interface ICard {
  id: string;
  description:string;
  image: string;
  title: string;
  category: string;
  price: number;

  isInBasket: boolean;
}

export interface IBasketData {
  items: TCardMiniInfo[];
  total: number;
  
  addItem(item: TCardMiniInfo): void;
  deleteItem(item: TCardMiniInfo, playload: Function | null): void;
  getNumberOfItems(items: ICard[]): number;
  getTotal(items: ICard[]): number;
}

//для каталога карточек
export interface ICardsData {
  _cards: ICard[];
  _preview: string | null; //для превью выбранной карточки
  
  addCards(cards: ICard[]): void;
  updateCard(card: ICard): void;
  getCard(cardId: string): ICard;
}

export interface IOrder {
  payment: string;
  address: string;
}

export interface IContact {
  email: string;
  phone: string;
}

export type IOderData = IOrder & IContact & {
  total: number;
};

export type TTotalBasket = Pick<IBasketData, 'total'>;

export type TCardMiniInfo = Pick<ICard, 'id'| 'title'|'price'| 'isInBasket'>