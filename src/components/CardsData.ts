import { ICard, ICardsData } from '../types/index';
import { IEvents } from './base/events';

export class CardsData implements ICardsData {
	protected _cards: ICard[];
	preview: string | null;
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

	set cards(cards: ICard[]) {
		this._cards = cards;
		this.events.emit('cards:changed');
	}

	get cards() {
		return this._cards;
	}

	//возвращает карточку по её id
	getCard(cardId: string): ICard {
		return this._cards.find((card) => card.id === cardId);
	}

	//устанавливает превью выбранной карточки
	setPreview(item: ICard) {
    this.preview = item.id;
		this.events.emit('preview:changed', item);
	}

}
