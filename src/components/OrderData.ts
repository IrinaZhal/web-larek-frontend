import { IContactForm, IOrderData } from '../types';
import { IEvents } from './base/events';

export type FormErrors = Partial<Record<keyof IOrderData, string>>;

export class OrderData implements IOrderData {
	protected _payment: string;
	protected _address: string;
	protected _email: string;
	protected _phone: string;
	orderFormErrors: FormErrors = {};
	contactsFormErrors: FormErrors = {};

	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

	set payment(value: string) {
		this._payment = value;
		this.events.emit('order.payment:change');

		if (this.validateOrder()) {
			this.events.emit('order:ready', this);
		}
	}

	set address(value: string) {
		this._address = value;
		this.events.emit('address:change');

		if (this.validateOrder()) {
			this.events.emit('order:ready', this);
		}
	}

	set phone(value: string) {
		this._phone = value;
		this.events.emit('phone:change');

		if (this.validateContacts()) {
			this.events.emit('contacts:ready', this);
		}
	}

	set email(value: string) {
		this._email = value;
		this.events.emit('email:change');

		if (this.validateContacts()) {
			this.events.emit('contacts:ready', this);
		}
	}

	get payment() {
		return this._payment;
	}

	get address() {
		return this._address;
	}

	get phone() {
		return this._phone;
	}

	get email() {
		return this._email;
	}

	//reset
	resetOrderData() {
		this._payment = '';
		this._address = '';
		this._phone = '';
		this._email = '';
	}

	//валидация заказа
	validateOrder() {
		const errors: typeof this.orderFormErrors = {};
		if (!this.payment) {
			errors.payment = 'Необходимо выбрать оплату';
		}
		if (!this.address) {
			errors.address = 'Необходимо указать адрес';
		}
		this.orderFormErrors = errors;
		this.events.emit('orderFormErrors:change', this.orderFormErrors);
		return Object.keys(errors).length === 0;
	}

	//валидация контактов
	validateContacts() {
		const errors: typeof this.contactsFormErrors = {};
		if (!this.email) {
			errors.email = 'Необходимо указать email';
		}
		if (!this.phone) {
			errors.phone = 'Необходимо указать телефон';
		}
		this.contactsFormErrors = errors;
		this.events.emit('contactsFormErrors:change', this.contactsFormErrors);
		return Object.keys(errors).length === 0;
	}
}
