import { IBasketData } from '../types';
import { cloneTemplate, createElement, ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';

interface IBasketView {
	items: HTMLElement[];
	total: number;
}

export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLElement;
	protected events: IEvents;

	constructor(protected container: HTMLTemplateElement, events: IEvents) {
		super(container);
		this.events = events;
		this.container = cloneTemplate(container);

		this._list = this.container.querySelector('.basket__list');
		this._total = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');

		this._button.addEventListener('click', () =>
			this.events.emit('order:open')
		);

		this.items = [];
	}

	set total(total: number) {
		this._total.textContent = `${total} синапсов`;

		if (total === 0) {
			this._button.setAttribute('disabled', '');
		} else {
			this._button.removeAttribute('disabled');
		}
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}
}
