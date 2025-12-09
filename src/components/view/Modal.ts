export class Modal {
  private closeBtn: HTMLElement;
  private content: HTMLElement;

  constructor(private container: HTMLElement) {
    this.closeBtn = container.querySelector('.modal__close')!;
    this.content = container.querySelector('.modal__content')!;


    this.closeBtn.addEventListener('click', () => this.close());

    this.container.addEventListener('click', (event) => {
      if (event.target === this.container) {
        this.close();
      }
    });
  }

  open(content: HTMLElement) {
    this.setContent(content);
    this.container.classList.add('modal_active');
  }

  close() {
    this.container.classList.remove('modal_active');
  }

  setContent(content: HTMLElement) {
    this.content.innerHTML = ''
    this.content.appendChild(content);
  }
}
