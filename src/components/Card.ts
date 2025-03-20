import { IBasketData, ICard } from '../types';
import { cloneTemplate } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';

interface ICardActions {
	onClick: () => void;
}

export class Card extends Component<ICard> {
	protected events: IEvents;
	protected cardId: string;

	protected cardDescription?: HTMLElement;
	protected cardImage?: HTMLImageElement;
	protected cardTitle: HTMLElement;
	protected cardCategory?: HTMLElement;
	protected cardPrice: HTMLElement;
	protected cardCounter?: HTMLElement;
	cardButton?: HTMLElement;

	//или передаем аргумент темлейта через cloneTemplate(template)
	constructor(
		protected container: HTMLTemplateElement,
		actions?: ICardActions
	) {
		super(container);
		this.container = cloneTemplate(container);

		this.cardTitle = this.container.querySelector('.card__title');
		this.cardCategory = this.container.querySelector('.card__category');
		this.cardPrice = this.container.querySelector('.card__price');
		this.cardImage = this.container.querySelector('.card__image');
		this.cardDescription = this.container.querySelector('.card__text');
		this.cardButton = this.container.querySelector('.card__button');
		this.cardCounter = this.container.querySelector('.basket__item-index');

		if (actions?.onClick) {
			if (this.cardButton) {
				this.cardButton.addEventListener('click', actions.onClick);
			} else {
				this.container.addEventListener('click', actions.onClick);
			}
		}

		/*
    if (container.id === 'card-catalog') { 
      this.container.addEventListener('click', () => 
      this.events.emit('card:select', {card : this})
    );}
  */
		/*
    if (this.deleteButton){
    this.deleteButton.addEventListener('click', () =>
      this.events.emit('item:delete', {card : this})
    )
  }
    if (this.buyButton){
    this.buyButton.addEventListener('click', () =>
    this.events.emit('item:addToBasket', {card : this})
    )}
  */
	}

	//добавляем значения через родительский render()

	set description(text: string) {
		if (this.cardDescription) {
			this.cardDescription.textContent = text;
		}
	}

	set price(price: number | null) {
		if (price === null) {
			this.cardPrice.textContent = 'Бесценно';
			if (
				price === null &&
				this.cardButton &&
				!this.cardButton.classList.contains('basket__item-delete')
			) {
				this.cardButton.setAttribute('disabled', '');
				this.cardButton.textContent = 'Не надо оформлять';
			}
			/*
      if (price && this.cardButton && !this.cardButton.classList.contains('basket__item-delete')) {
       this.cardButton.textContent = 'В корзину';
    }*/
		} else {
			this.cardPrice.textContent = `${price} синапсов`;
		}
	}

	set button(value: string) {
		if (
			this.cardButton &&
			!this.cardButton.classList.contains('basket__item-delete')
		) {
			this.cardButton.textContent = value;
		}
	}

	set category(category: string) {
		if (this.cardCategory) {
			this.cardCategory.textContent = category;

			switch (category) {
				case 'софт-скил':
					this.cardCategory.classList.add('card__category_soft');
					break;
				case 'хард-скил':
					this.cardCategory.classList.add('card__category_hard');
					break;
				case 'другое':
					this.cardCategory.classList.add('card__category_other');
					break;
				case 'дополнительное':
					this.cardCategory.classList.add('card__category_additional');
					break;
				case 'кнопка':
					this.cardCategory.classList.add('card__category_button');
					break;
			}
		}
	}

	set image(src: string) {
		if (this.cardImage) {
			this.cardImage.src = src;
		}
	}

	set title(title: string) {
		this.cardTitle.textContent = title;
	}

	set counter(value: number) {
		this.cardCounter.textContent = `${value}`;
	}

	set id(id) {
		this.cardId = id;
	}

	get id() {
		return this.cardId;
	}

	deleteCard() {
		this.container.remove();
		this.container = null;
	}
}
