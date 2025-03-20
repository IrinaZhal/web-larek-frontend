import { IBasketData, ICard } from '../types';
import { IEvents } from './base/events';

export class BasketData implements IBasketData {
	protected _items: ICard[];
	protected _total: number;
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
		this._items = [];
		this._total = 0;
	}

	addItem(item: ICard) {
		this._items.push(item);
		this.events.emit('basket:changed');
	}

	deleteItem(item: ICard) {
		this._items = this._items.filter((goods) => goods.id !== item.id);
		this.events.emit('basket:changed');
	}

	clearBasket() {
		this._items = [];
		this.events.emit('basket:changed');
	}

	get total() {
		if (!this._items.length) {
			return (this._total = 0);
		}
		return (this._total = this._items.reduce((a, b) => a + b.price, 0));
	}

	getBasketIds() {
		const ids = this._items.map((item) => {
			return item.id;
		});
		return ids;
	}

	get items() {
		return this._items;
	}

	isInBasket(cardId: string) {
		if (this._items.find((item) => item.id === cardId)) {
			return true;
		}
	}
}
