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
import {Order} from "./components/view/form/Order.ts";
import {Contacts} from "./components/view/form/Contacts.ts";
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
const headerModel = new Header(headerContainer, eventBroker);
const cardsGalleryModel = new Gallery(galleryContainer);
const modal = new Modal(modalContainer);
const shoppingCart = new ShoppingCart(eventBroker);
const buyer = new Buyer();
const order = new Order(cloneTemplate(orderTemplate), eventBroker);
const contacts = new Contacts(cloneTemplate(contactsTemplate), eventBroker);
const success = new Success(cloneTemplate(successTemplate), eventBroker);

// ========== Подписки на события ==========
eventBroker.on('change:counter', () => {
  headerModel.counter = shoppingCart.getCartTotalQuantity()
})

eventBroker.on('shoppingCart:open', () => {
  const basket = new Basket(cloneTemplate(basketTemplate), () => eventBroker.emit('order:set'));
  const totalPrice = shoppingCart.getCartTotalPrice();
  if (totalPrice === 0) {
    basket.buttonOrder = false;
    return modal.open(basket.render({cards: []}));
  }
  const itemsBasketEl: HTMLElement[] = shoppingCart.getCartItems().map(
    (item: IProduct, index: number) => {
      const cardBasketEl = new CardBasket(
        cloneTemplate(cardBasketTemplate),
        {onClick: () => eventBroker.emit('cardBasket:remove', item)}
      )
      cardBasketEl.index = index + 1

      return cardBasketEl.render(item)
    }
  )
  basket.basketPrice = totalPrice;
  basket.buttonOrder = true;
  modal.open(basket.render({cards: itemsBasketEl}))
})

eventBroker.on('cardBasket:remove', (item: IProduct) => {
  shoppingCart.removeItemFromCart(item);
  eventBroker.emit('shoppingCart:open');
})

eventBroker.on('products:loaded', (items: IProduct[]) => {
  const cardElements: HTMLElement[] = items.map(product => {
    const card = new CardCatalog(
      cloneTemplate(cardGalleryTemplate),
      { onClick: () => eventBroker.emit('card:select', product) }
    );

    return card.render(product);
  });

  cardsGalleryModel.render({cards: cardElements});
});

eventBroker.on('card:select', (product: IProduct) => {
  const cardEl: HTMLElement = cloneTemplate(cardPreviewTemplate);
  const cardElement: CardPreview = new CardPreview(cardEl, {
    onClick: () => eventBroker.emit('cardButton:click', product)
  });
  cardElement.inCart = shoppingCart.checkItemInCart(product.id);
  modal.open(cardElement.render(product));
});

eventBroker.on('cardButton:click', (product: IProduct) => {
  const cardButton = document.querySelector('.card__button') as HTMLElement;
  if (shoppingCart.checkItemInCart(product.id)) {
    shoppingCart.removeItemFromCart(product);
    cardButton.textContent = 'Купить';
  } else {
    cardButton.textContent = 'Удалить из корзины'
    shoppingCart.addToCart(product);
  }
});

eventBroker.on('order:set', () => {
  modal.open(order.render());

  const address = buyer.getAddress();
  if (address) order.setAddress(address);

  const payment = buyer.getPayment();
  if (payment) order.setPaymentButtonActive(payment);


  const errors: TFormErrors = buyer.validate();
  if (errors.address && errors.payment) return;
  order.showErrors(errors);
  order.submitButton(!errors.address && !errors.payment);
});

eventBroker.on('order:update', (data: { address?: string; payment?: TPayment }) => {
  buyer.update(data);

  const errors: TFormErrors = buyer.validate();
  order.showErrors(errors);
  order.submitButton(!errors.address && !errors.payment);

  if (data.payment) order.setPaymentButtonActive(data.payment);
  if (data.address) order.setAddress(data.address);
});

eventBroker.on('contacts:set', () => {
  modal.open(contacts.render());

  const email = buyer.getEmail();
  if (email) contacts.setEmail(email);

  const phone = buyer.getPhone();
  if (phone) contacts.setPhone(phone);


  const errors: TFormErrors = buyer.validate();
  if (errors.email && errors.phone) return;
  contacts.showErrors(errors);
  contacts.submitButton(!errors.email && !errors.phone);
});

eventBroker.on('contacts:update', (data: { phone?: string; email?: string }) => {
  buyer.update(data);

  const errors: TFormErrors = buyer.validate();
  contacts.showErrors(errors);
  contacts.submitButton(!errors.address && !errors.payment);

  if (data.phone) contacts.setPhone(data.phone);
  if (data.email) contacts.setEmail(data.email);
})

eventBroker.on('success:show', async () => {
  const payment = buyer.getPayment();
  const email = buyer.getEmail();
  const phone = buyer.getPhone();
  const address = buyer.getAddress();

  if (!payment || !email || !phone || !address) return null;

  const cartItems: IProduct[] = shoppingCart.getCartItems();

  const data: TOrder = {
    payment,
    email,
    phone,
    address,
    total: shoppingCart.getCartTotalPrice(),
    items: cartItems.map((item: IProduct) => item.id)
  };

  try {
    const response: TOrderResponse = await api.postOrder(data);
    success.orderSuccessDescription = response.total;
    modal.open(success.render());
  } catch (error) {
    console.error('Ошибка при отправке заказа:', error);
  }
});

eventBroker.on('success:close', () => {
  buyer.clear();
  shoppingCart.removeAllItemsFromCart()
  modal.close();
});


// ========== Получение данных через API ==========
try {
  const response: IApiProducts = await api.getProducts();
  productsModel.setItems(response.items)
} catch (error) {
  console.error('Ошибка при загрузке товаров:', error);
}
