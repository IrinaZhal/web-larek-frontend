import { IOrderForm } from "../types";
import { IEvents } from "./base/events";
import { Form } from "./common/Form";


export class Order extends Form<IOrderForm> {
  buttonCash: HTMLButtonElement;
  buttonCard: HTMLButtonElement;
  
  constructor(container: HTMLFormElement, events: IEvents) {
      super(container, events);
      this.events = events;
      
      this.buttonCash = this.container.elements.namedItem('cash') as HTMLButtonElement;
      this.buttonCard = this.container.elements.namedItem('card') as HTMLButtonElement;
      
      this.buttonCash.addEventListener('click', () => this.events.emit('order.payment:cash'));
      this.buttonCard.addEventListener('click', () => this.events.emit('order.payment:card'));
  }

  set address(value: string) {
      (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
  }
}