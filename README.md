# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении

Карточка
```
export interface ICard {
  _id: string;
  description:string;
  image: string;
  title: string;
  category: string;
  price: number;
  
  isInBasket: boolean; //возможно метод
}
```
Корзина
```
export interface IBasketData {
  items: ICard[];
  total: number;
  preview: string | null; //для превью корзины
}
```

Данные карточки для корзины 
```
export type TCardMiniInfo = Pick<ICard, 'title'|'price'>
```

Данные о сумме из коризины
```
export type TTotalBasket = Pick<IBasket, 'total'>;
```

Интерфейс для массива карточек
```
export interface ICardsData {
  cards: ICard[];
  preview: string | null; //для превью выбранной карточки
}
```

Данные заказа
```
export interface IOrder {
  payment: string;
  address: string;
}
```

Данные контактов
```
export interface IContact {
  email: string;
  phone: string;
}
```
Общие данные с деталями заказа
```
type IOderData = IOrder & IContact & {
  total: number;
};
```

## Базовый код

### Класс EventEmitter - есть в изначальной версии проекта.

Реализует паттерн «EventEmitter» и позволяет подписываться на события и уведомлять подписчиков о наступлении события.
Методы on ,  off ,  emit  — для подписки на событие, отписки от события и уведомления подписчиков о наступлении события соответственно.
Дополнительно реализованы методы  onAll и  offAll  — для подписки на все события и сброса всех подписчиков. 

Метод  trigger генерирует заданное событие с заданными аргументами. Это позволяет передавать его в качестве обработчика события в другие классы. Эти классы будут генерировать события, не будучи при этом напрямую зависимыми от класса  EventEmitter.

### Класс Api - есть в изначальной версии проекта.

Класс описывает логику работы с сервером. 
Констурктор:
```
constructor(baseUrl: string, options: RequestInit = {})
```
Принимает адрес сервера(url) и опциональный объект с заголовками запросов.

Методы:

- get - для GET запросов на сервер. Принимает часть адреса в качестве аргумента, возвращает промис с объектом, которым ответил сервер.
- post - принимает объекты с данными, которые необходимо отправить, часть адреса отправки и метод запроса (по умолчанию POST).


## Компоненты модели данных

### Class CardsData

Класс отвечает за работу с массивом карточек.\

В полях класса хранятся следующие данные:

- _cards: ICard[]; - массив карточек.
- _preview: string | null; - храним id выбранной карточки для превью в модальном окне.
- events: IEvents - экземпляр класса EventEmitter для инициации событий при изменении данных.

Методы:
- addCards(cards: ICard[]): void; - сохраняем массив с карточками.
- updateCard(card: ICard): void; - обновляем карточку, если это необходимо (например, после добавления в корзину).
- getCard(cardId: string): ICard; - возвращает карточку по её id.
- сеттеры и геттеры для работы с полями класса

### Class BasketData

Класс для работы с карточками, отправленными в корзину.\

В полях класса хранятся следующие данные:
- items: TCardMiniInfo[]; - массив инфы карточек, отправленных в корзину
- total: number; - сумма всех товаров в корзине

Методы:
- addItem(item: TCardMiniInfo): void; - для добавления карточек в корзину
- deleteItem(item: TCardMiniInfo, playload: Function | null): void; - удаления карточек из карзины
- getNumberOfItems(items: ICard[]): number; - получить количество товаров в корзине (понадобится для вывода на страницу в counter)
- getTotal(items: ICard[]): number; - получить общую сумму товаров в корзине

### Class OrderData

Класс для сбора информации о заказе.\
Поля класса должны собирать необходимую о заказе информацию
- payment: string; - тип оплаты
- address: string; - адрес заказа
- email: string; - почта оставившего заказ
- phone: string; - телефон оставившего заказ

Методы:
- сеттеры значений.
- Ordervalidation() - метод для валидации.

## Компоненты отображения

Отвечают за отображение внутри контейнера передаваемых в них данных.

### Класс Modal
Универсальный класс реализациии модального окна.\

Поля:
- protected closeButton: HTMLButtonElement; - кнопка закрытия попапа
- protected _content: HTMLElement; - внутренний контент попапа

Констуктор:\
```
constructor(container: HTMLElement, protected events: IEvents);
```
принимает содержимое контента и экземпляр класса EventEmitter для инициации событий при изменении данных.

Методы:
- set content(value: HTMLElement); - меняем контент внутри попапа;
- open(); - открываем модалку;
- close(); - закрываем модалку;

### Class Basket

Класс для отображения корзины и ее содержимого.\

В полях класса хранятся следующие данные:
- _list: HTMLElement; - лист с товарами для отображения карточек
- _button: HTMLElement; - кнопка сабмита
- _total: HTMLElement; - общая сумма заказа
- events: IEvents - экземпляр класса EventEmitter для инициации событий при изменении данных.

Методы:
- set items(items: HTMLElement[]) - заполняем корзину товарами
- render() - возвращает сгенерированную верстку корзины

### Class Form

Класс для работы с формами.  

Поля:
- protected formElement: HTMLFormElement; - форма
- protected _submit: HTMLButtonElement; - кнопка сабмита формы
- protected _errors: HTMLElement; - элемент для вывода ошибок
- events: IEvents - экземпляр класса EventEmitter для инициации событий при изменении данных.

Методы:
- set errors() - установка ошибки валидации
- clearValue() - очистка формы
- render() - возвращение элемента формы

### Class Order extends Form

Класс с формой для заказа - выбора типа оплаты и установки адреса.\

Методы класса:
- set payment(value: string) - для типа оплаты
- set address(value: string) - для адреса 


### Class Contact extends Form

Класс с формой для контактов - два инпута для ввода email и телефона.\

Методы класса:
- set email(value: string) - для email
- set phone(value: string) - для телефона


### Сlass Success

Класс для демонстрации успешного завершения заказа.\

Поля класса:
- _button: HTMLButtonElement - кнопка сабмита окошка, должна закрывать и очищать модалку

Метод:
- set total - метод, который позволит указывать общую сумму, потраченную на товары.

### Class Card 

Основной класс карточки.

Поля:
id: string; - уникальный идентификатор 
description?:string; - описание карточки
image?: string; - ссылка на картинку
title: string; - название товара
category?: string; - категория товара
price: number | null; - цена товара

Методы:

- setData(): - поставить значения в каточку
- render(): возвращает карточку с разметкой
- isInBasket(): boolean; - метод который определяет была ли отправлена карточка в корзину
- геттер id возвращает уникальный идентификатор

### Class CardPreview extends Card

Класс для превью карточки в модальном окне. Принимает темплейт карточки для превью экземпляр класса EventEmitter для инициации событий при изменении данных.

Поля:
- _button: HTMLElement; - для кнопки в корзину


### Class BasketItem extends Card

Класс для демонстрации карточки в листе товаров корзины. Принимает темплейт карточки для превью экземпляр класса EventEmitter для инициации событий при изменении данных.

Поля:
- _button: HTMLElement; - для кнопки удаления из корзины


## Презентер

Код презентера не выделен в отдельный класс, а будет размещен в основном скрипте приложения - файле 'index.ts'.\
Используем один экземляр брокера событий.\
События:
- 'cards:changed' - изменения массива карточек;
- 'card:selected' - выбор карточки по клику;
- 'card:priviewClear' - очистка превью карточки

События при взаимодействии с пользователем:
- 'basket:open' - открытие модального окна с корзиной
- 'card:select' - открытие модального окна с карточкой
- 'item:addToBasket' - добавляем товар в корзину
- 'item:delete' - удаление товара из корзины
- 'order:open' - открытие модального окна с деталями заказа
- 'contact:open' - открытие модального окна с заполнением контактов
- 'success:open' - открытие модального окна с заполнением контактов
- 'email:input' - ввод данных в поле email
- 'phone:input' - ввод данных в поле phone
- 'address:input' - ввод данных в поле address
- 'order:submit' - сохранение данных с деталями заказа
- 'contact:submit' - сохранение контактов
- 'success:submit' - кнопка и кнопка закрытия модального окна с успешным завершением заказа должна закрывать модальное окно и очищать корзину
- 'order:validation' - событие необходимое для валидации полей заказа
- 'contact:validation' - событие необходимое для валидации полей
- 'modal:clear' - событие для очистки модалок




