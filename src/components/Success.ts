import { cloneTemplate, ensureElement } from '../utils/utils';
import { Component } from './base/Component';

interface ISuccess {
	total: number;
}

interface ISuccessActions {
	onClick: () => void;
}

export class Success extends Component<ISuccess> {
	protected _close: HTMLElement;
	protected successTotal: HTMLElement;

	constructor(
		protected container: HTMLTemplateElement,
		actions: ISuccessActions
	) {
		super(container);
		this.container = cloneTemplate(container);

		this._close = ensureElement<HTMLElement>(
			'.order-success__close',
			this.container
		);
		this.successTotal = this.container.querySelector(
			'.order-success__description'
		);

		if (actions?.onClick) {
			this._close.addEventListener('click', actions.onClick);
		}
	}

	set total(value: number) {
		this.successTotal.textContent = `Списано ${value} синапсов`;
	}
}
