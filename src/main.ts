import './scss/styles.scss';

import { Products } from './components/models/products.ts';
import { ShoppingCart } from './components/models/shopping-cart.ts';
import { Buyer } from './components/models/buyer.ts';
import {
  IApiProducts,
  IProduct,
  TFormErrors,
  TOrder, TOrderResponse,
  TPayment
} from "./types";
import {LarekApi} from "./components/api/larek-api.ts";
import {Api} from "./components/base/Api.ts";
import {API_URL} from "./utils/constants.ts";
import {CardCatalog} from "./components/view/card/CardCatalog.ts";
import {cloneTemplate} from "./utils/utils.ts";
import {EventEmitter} from "./components/base/Events.ts";
import {Modal} from "./components/view/Modal.ts";
import {CardPreview} from "./components/view/card/CardPreview.ts";
import {Header} from "./components/view/Header.ts";
import {Gallery} from "./components/view/Gallery.ts";
import {CardBasket} from "./components/view/card/CardBasket.ts";
import {Basket} from "./components/view/Basket.ts";
import {OrderForm} from "./components/view/form/OrderForm.ts";
import {ContactsForm} from "./components/view/form/ContactsForm.ts";
import {Success} from "./components/view/Success.ts";


// ========== HTML элементы ==========
const headerContainer = document.querySelector('.header') as HTMLElement;
const galleryContainer = document.querySelector('.gallery') as HTMLElement;
const modalContainer = document.querySelector('.modal') as HTMLElement;

// ========== Шаблоны ==========
const cardGalleryTemplate = document.getElementById('card-catalog') as HTMLTemplateElement;
const cardPreviewTemplate = document.getElementById('card-preview') as HTMLTemplateElement;
const basketTemplate = document.getElementById('basket') as HTMLTemplateElement;
const cardBasketTemplate = document.getElementById('card-basket') as HTMLTemplateElement;
const orderTemplate = document.getElementById('order') as HTMLTemplateElement;
const contactsTemplate = document.getElementById('contacts') as HTMLTemplateElement;
const successTemplate = document.getElementById('success') as HTMLTemplateElement;

// ========== Инициализация моделей ==========
const api = new LarekApi(new Api(API_URL));
const eventBroker = new EventEmitter();
const productsModel = new Products(eventBroker);
const shoppingCartModel = new ShoppingCart(eventBroker);
const buyerModel = new Buyer(eventBroker);

// ========== Инициализация представлений ==========
const headerView = new Header(headerContainer, eventBroker);
const galleryView = new Gallery(galleryContainer);
const basketView = new Basket(cloneTemplate(basketTemplate), eventBroker);
const modalView = new Modal(modalContainer);
const orderFormView = new OrderForm(cloneTemplate(orderTemplate), eventBroker);
const contactFormView = new ContactsForm(cloneTemplate(contactsTemplate), eventBroker);
const successView = new Success(cloneTemplate(successTemplate), eventBroker);

// ========== Подписки на события ==========
eventBroker.on('change:counter', () => {
  headerView.counter = shoppingCartModel.getCartTotalQuantity()
  headerView.render();
})

eventBroker.on('shoppingCart:open', () => {
  const cardsBasketEl: HTMLElement[] = shoppingCartModel.getCartItems().map(
    (cartItem, index) => {
    const cardBasketEl  = new CardBasket(
        cloneTemplate(cardBasketTemplate),
        {onClick: () => eventBroker.emit('cardBasket:remove', cartItem)}
      );
    cardBasketEl.index = index + 1;
    return cardBasketEl.render(cartItem);
    });

  basketView.setCards(cardsBasketEl);
  basketView.basketPrice = shoppingCartModel.getCartTotalPrice();
  basketView.buttonOrder = shoppingCartModel.getCartTotalQuantity() > 0;
  modalView.open(basketView.render());
})

eventBroker.on('cardBasket:remove', (item: IProduct) => {
  shoppingCartModel.removeItemFromCart(item);
})

eventBroker.on('shoppingCart:update', (items: IProduct[]) => {
  const cardsBasketEl: HTMLElement[] = items.map((item, index) => {
    const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
      onClick: () => shoppingCartModel.removeItemFromCart(item) // только модель меняет данные
    });
    card.index = index + 1;
    return card.render(item);
  });

  basketView.setCards(cardsBasketEl);
  basketView.basketPrice = shoppingCartModel.getCartTotalPrice();
  basketView.buttonOrder = shoppingCartModel.getCartTotalQuantity() > 0;
});

eventBroker.on('products:loaded', (items: IProduct[]) => {
  const cardElements: HTMLElement[] = items.map(product => {
    const card = new CardCatalog(
      cloneTemplate(cardGalleryTemplate),
      { onClick: () => eventBroker.emit('card:select', product) }
    );

    return card.render(product);
  });

  galleryView.render({cards: cardElements});
});

eventBroker.on('card:select', (product: IProduct) => {
  const cardEl: HTMLElement = cloneTemplate(cardPreviewTemplate);
  const cardElement: CardPreview = new CardPreview(cardEl, {
    onClick: () => eventBroker.emit('cardButton:click', product)
  });
  cardElement.inCart = shoppingCartModel.checkItemInCart(product.id);
  modalView.open(cardElement.render(product));
});

eventBroker.on('cardButton:click', (product: IProduct) => {
  const cardButton = document.querySelector('.card__button') as HTMLElement;
  if (shoppingCartModel.checkItemInCart(product.id)) {
    shoppingCartModel.removeItemFromCart(product);
    cardButton.textContent = 'Купить';
  } else {
    cardButton.textContent = 'Удалить из корзины'
    shoppingCartModel.addToCart(product);
  }
});

eventBroker.on('order:set', () => {
  modalView.open(orderFormView.render());

  const address = buyerModel.getAddress();
  if (address) orderFormView.setAddress(address);

  const payment = buyerModel.getPayment();
  if (payment) orderFormView.setPaymentButtonActive(payment);

  const errors: TFormErrors = buyerModel.validate();
  if (errors.address && errors.payment) return;
  orderFormView.showErrors(errors);
  orderFormView.submitButton(!errors.address && !errors.payment);
});

eventBroker.on('order:update', (data: { address?: string; payment?: TPayment }) => {
  buyerModel.update(data);
});

eventBroker.on('contacts:set', () => {
  modalView.open(contactFormView.render());

  const email = buyerModel.getEmail();
  if (email) contactFormView.setEmail(email);

  const phone = buyerModel.getPhone();
  if (phone) contactFormView.setPhone(phone);


  const errors: TFormErrors = buyerModel.validate();
  if (errors.email && errors.phone) return;
  contactFormView.showErrors(errors);
  contactFormView.submitButton(!errors.email && !errors.phone);
});

eventBroker.on('contacts:update', (data: { phone?: string; email?: string }) => {
  buyerModel.update(data);
})

eventBroker.on('buyer:update', (buyer: Buyer) => {
  orderFormView.setAddress(buyer.getAddress() || '');
  orderFormView.setPaymentButtonActive(buyer.getPayment() || '');
  const orderValid = orderFormView.showErrors(buyer.validate());
  orderFormView.submitButton(orderValid);

  contactFormView.setEmail(buyer.getEmail() || '');
  contactFormView.setPhone(buyer.getPhone() || '');
  const contactsValid = contactFormView.showErrors(buyer.validate());
  contactFormView.submitButton(contactsValid);
});




eventBroker.on('success:show', async () => {
  const payment = buyerModel.getPayment();
  const email = buyerModel.getEmail();
  const phone = buyerModel.getPhone();
  const address = buyerModel.getAddress();

  if (!payment || !email || !phone || !address) return null;

  const cartItems: IProduct[] = shoppingCartModel.getCartItems();

  const data: TOrder = {
    payment,
    email,
    phone,
    address,
    total: shoppingCartModel.getCartTotalPrice(),
    items: cartItems.map((item: IProduct) => item.id)
  };

  try {
    const response: TOrderResponse = await api.postOrder(data);
    successView.orderSuccessDescription = response.total;
    shoppingCartModel.removeAllItemsFromCart()
    modalView.open(successView.render());
  } catch (error) {
    console.error('Ошибка при отправке заказа:', error);
  }
});

eventBroker.on('success:close', () => {
  modalView.close();
});


// ========== Получение данных через API ==========
try {
  const response: IApiProducts = await api.getProducts();
  productsModel.setItems(response.items)
} catch (error) {
  console.error('Ошибка при загрузке товаров:', error);
}
