
//абстрактный класс, как базовый компонент для разметки
export abstract class Component<T> {
  constructor(protected readonly container: HTMLElement) {

  }

  protected setText(element: HTMLElement, value: unknown) {
    if (element) {
        element.textContent = String(value);
    }
}
  
   // Скрыть
   protected setHidden(element: HTMLElement) {
    element.style.display = 'none';
   }

// Показать
   protected setVisible(element: HTMLElement) {
    element.style.removeProperty('display');
  }
  
  setDisabled(element: HTMLElement, state: boolean) {
  if (element) {
      if (state) element.setAttribute('disabled', 'disabled');
      else element.removeAttribute('disabled');
  }
}

  //парaметр data необязательный
  // используем оператор ??, если значение undefined | null
  render(data?: Partial<T>): HTMLElement {
      Object.assign(this as object, data ?? {});
      return this.container;
  }
}

