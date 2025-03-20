import './scss/styles.scss';

import { CardsData } from './components/CardsData';
import { EventEmitter } from './components/base/events';
import { BasketData } from './components/BasketData';
import { API_URL, CDN_URL, settings } from './utils/constants';
import { Api } from './components/base/api';
import { IApi, ICard, IContactForm, IOrderForm } from './types';
import { AppApi } from './components/AppApi';
import { Card } from './components/Card';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Basket } from './components/Basket';
import { Modal } from './components/common/Modal';
import { Success } from './components/Success';
import { Page } from './components/Page';
import { Contacts } from './components/Contacts';
import { OrderData } from './components/OrderData';
import { Order } from './components/Order';

//События и api
const events = new EventEmitter();
const api = new AppApi(CDN_URL, API_URL);

//для теста событий
/*
events.onAll((events) => {
	console.log(events.eventName, events.data);
});*/

//Модели
const cardsData = new CardsData(events);
const basketData = new BasketData(events);
const orderData = new OrderData(events);

//Темлпейты
const cardTemplateCatalog = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardTemplatePreview = ensureElement<HTMLTemplateElement>('#card-preview');
const cardTemplateBasket = ensureElement<HTMLTemplateElement>('#card-basket');
const modalContainer = ensureElement<HTMLElement>('#modal-container');
const basketPreview = ensureElement<HTMLTemplateElement>('#basket');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

//Основные части отображения
const page = new Page(document.body, events);
const basket = new Basket(basketPreview, events);
const modal = new Modal(modalContainer, events);
const order = new Order(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);

//получаем карточки с сервера
api
	.getCards()
	.then((cards) => {
		cardsData.cards = cards;
	})
	.catch((err) => {
		console.error(err);
	});

//если изменился массив картинок
events.on('cards:changed', () => {
	const cardsArray = cardsData.cards.map((card) => {
		const cardInstant = new Card(cardTemplateCatalog, {
			onClick: () => {
			events.emit('card:select', {card});
			}
		});
		return cardInstant.render(card);
	});
  
	page.render({ catalog: cardsArray });

});

//открыть корзину
events.on('basket:open', () => {
	const basketList = basketData.items.map((card) => {
		const cardInstant = new Card(cardTemplateBasket, {
			onClick: () => {
				events.emit('item:delete', card);
			}
			});
		cardInstant.counter = basketData.items.indexOf(card) + 1;
		return cardInstant.render(card);
	});

	basket.total = basketData.total;
	modal.render({ content: basket.render({ items: basketList }) });
});

//клик по карточке в каталоге
events.on('card:select', (data: {card: Card}) => {
	const { card } = data;
	cardsData.setPreview(cardsData.getCard(card.id));
});

//установка превью
events.on('preview:changed', (item: ICard) => {
	const cardPreview = new Card(cardTemplatePreview, {
		onClick: () => {
    if (!basketData.isInBasket(item.id)) {
		events.emit('item:addToBasket', item);
		cardPreview.button = 'Удалить из корзины';
		} else {
		events.emit('item:delete', item);
		cardPreview.button = 'В корзину';
		}
	}
});
  if (!basketData.isInBasket(item.id)) {
		cardPreview.button = 'В корзину';
	}else {
		cardPreview.button = 'Удалить из корзины';
	}
	modal.render({content: cardPreview.render(item)});
});

//добавляем товар в корзину
events.on('item:addToBasket', (item: ICard) => {
	basketData.addItem(item);
});

//удаляем товар из корзины
events.on('item:delete', (item: ICard) => {
  basketData.deleteItem(item);
});

//изменение корзины
events.on('basket:changed', () => {
	const basketList = basketData.items.map((card) => {
		const cardInstant = new Card(cardTemplateBasket, {
			onClick: () => {
				events.emit('item:delete', card);
			}
			});
		cardInstant.counter = basketData.items.indexOf(card) + 1;
		return cardInstant.render(card);
	});
  page.counter = basketData.items.length;
	basket.total = basketData.total;
	basket.render({ items: basketList });
});

// Изменилось состояние валидации формы контактов
events.on('contactsFormErrors:change', (errors: Partial<IContactForm>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({phone, email}).filter(i => !!i).join('; ');
});

// Изменилось состояние валидации формы заказа
events.on('orderFormErrors:change', (errors: Partial<IOrderForm>) => {
	const { payment, address } = errors;
	order.valid = !payment && !address;
	order.errors = Object.values({payment, address}).filter(i => !!i).join('; ');
});

events.on('contacts.email:change', (data: { field: keyof IContactForm, value: string }) => {
	orderData.email = data.value;
});

events.on('contacts.phone:change', (data: { field: keyof IContactForm, value: string }) => {
	orderData.phone = data.value;
});

events.on('order.address:change', (data: { field: keyof IOrderForm, value: string }) => {
	orderData.address = data.value;
});

events.on('order.payment:cash', () => {
  orderData.payment = 'cash';
});

events.on('order.payment:card', () => {
	orderData.payment = 'card';
});

events.on('order.payment:change',() => {
if (orderData.payment === 'card') {
	order.buttonCash.classList.remove('button_alt-active');
  order.buttonCard.classList.add('button_alt-active');
}
if (orderData.payment === 'cash') {
	order.buttonCard.classList.remove('button_alt-active');
  order.buttonCash.classList.add('button_alt-active');
}
});

//открываем заказ
events.on('order:open', () => {
	orderData.resetOrderData();//очищаем прошлый заказ
  order.buttonCash.classList.remove('button_alt-active');//очищаем стили кнопок
  order.buttonCard.classList.remove('button_alt-active');
	modal.render({
		content: order.render({
				address: '',
				payment: '',
				valid: false,
				errors: []
		})
});
});

//сабмит заказа
events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
				phone: '',
				email: '',
				valid: false,
				errors: []
		})
});
});

//сабмит формы контактов: отправка Post-запроса с объектом на сервер
events.on('contacts:submit', () => {
	api.postOrder({
		items: basketData.getBasketIds(),
		total: basketData.total,
		payment: orderData.payment,
		phone: orderData.phone,
		email: orderData.email,
		address: orderData.address
	})
	.then((result) => {
			const success = new Success(successTemplate, {
					onClick: () => {
							modal.close();
					}
			});
      
			modal.render({
				content: success.render({ total: result.total })
			});
      
			orderData.resetOrderData();
			basketData.clearBasket();
	})
	.catch(err => {
			console.error(err);
	});

});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
    page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
    page.locked = false;
});


