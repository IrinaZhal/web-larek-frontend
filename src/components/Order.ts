import { IOrderForm } from '../types';
import { IEvents } from './base/events';
import { Form } from './common/Form';

export class Order extends Form<IOrderForm> {
	buttonCash: HTMLButtonElement;
	buttonCard: HTMLButtonElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this.events = events;

		this.buttonCash = this.container.elements.namedItem(
			'cash'
		) as HTMLButtonElement;
		this.buttonCard = this.container.elements.namedItem(
			'card'
		) as HTMLButtonElement;

		this.buttonCash.addEventListener('click', () =>
			this.events.emit('order.payment:cash')
		);
		this.buttonCard.addEventListener('click', () =>
			this.events.emit('order.payment:card')
		);
	}

	switchButton(button: string, value: boolean) {
		if (button === 'cash' && value) {
			this.buttonCash.classList.add('button_alt-active');
		}
		if (button === 'cash' && !value) {
			this.buttonCash.classList.remove('button_alt-active');
		}
		if (button === 'card' && value) {
			this.buttonCard.classList.add('button_alt-active');
		}
		if (button === 'card' && !value) {
			this.buttonCard.classList.remove('button_alt-active');
		}
	}

	set address(value: string) {
		(this.container.elements.namedItem('address') as HTMLInputElement).value =
			value;
	}
}
