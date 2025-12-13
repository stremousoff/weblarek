import './scss/styles.scss';

import { Products } from './components/models/products.ts';
import { ShoppingCart } from './components/models/shopping-cart.ts';
import { Buyer } from './components/models/buyer.ts';
import {
  IApiProducts,
  IProduct,
  TFormErrors,
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
const cardPreviewView = new CardPreview(cloneTemplate(cardPreviewTemplate), eventBroker);
const basketView = new Basket(cloneTemplate(basketTemplate), eventBroker);
const modalView = new Modal(modalContainer);
const orderFormView = new OrderForm(cloneTemplate(orderTemplate), eventBroker);
const contactFormView = new ContactsForm(cloneTemplate(contactsTemplate), eventBroker);
const successView = new Success(cloneTemplate(successTemplate), eventBroker);

// ========== Подписки на события ==========
eventBroker.on('shoppingCart:open', () => {

  basketView.renderedCards = shoppingCartModel.getCartItems().map(
    (cartItem, index) => {
      const cardBasketEl  = new CardBasket(
        cloneTemplate(cardBasketTemplate),
        {onClick: () => shoppingCartModel.removeItemFromCart(cartItem)}
      );
      cardBasketEl.index = index + 1;
      return cardBasketEl.render(cartItem);
    });
  basketView.totalPrice = shoppingCartModel.getCartTotalPrice();
  basketView.buttonOrder = shoppingCartModel.getCartTotalQuantity() > 0;
  modalView.open(basketView.render());
})

eventBroker.on('cardBasket:remove', (item: IProduct) => {
  shoppingCartModel.removeItemFromCart(item);
})

eventBroker.on('shoppingCart:update', () => {
  headerView.counter = shoppingCartModel.getCartTotalQuantity();
  headerView.render();

  basketView.renderedCards = shoppingCartModel.getCartItems().map((cartItem, index) => {
    const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
      onClick: () => shoppingCartModel.removeItemFromCart(cartItem)
    });
    card.index = index + 1;
    return card.render(cartItem);
  });
  basketView.totalPrice = shoppingCartModel.getCartTotalPrice();
  basketView.buttonOrder = shoppingCartModel.getCartTotalQuantity() > 0;
});

eventBroker.on('products:loaded', () => {
  galleryView.renderedCards = productsModel.getItems().map(product => {
    const card = new CardCatalog(
      cloneTemplate(cardGalleryTemplate),
      { onClick: () => eventBroker.emit('card:select', product) }
    );
    return card.render(product);
  });
});

eventBroker.on('card:select', (product: IProduct) => {
  productsModel.setCheckItemById(product.id);
})

eventBroker.on('card:loaded', () => {
  const product: IProduct = productsModel.getCheckItem()!
  const isInCart = shoppingCartModel.checkItemInCart(product.id);

  if (product.price === null) {
    cardPreviewView.buttonText = 'Недоступно';
    cardPreviewView.buttonDisabled = true;
  } else if (isInCart) {
    cardPreviewView.buttonText = 'Удалить из корзины';
    cardPreviewView.buttonDisabled = false;
  } else {
    cardPreviewView.buttonText = 'Купить';
    cardPreviewView.buttonDisabled = false;
  }

  modalView.open(cardPreviewView.render(product));
})

eventBroker.on('cardButton:click', () => {
  const product: IProduct = productsModel.getCheckItem()!;
  const inCart = shoppingCartModel.checkItemInCart(product.id);

  if (inCart) {
    shoppingCartModel.removeItemFromCart(product);
  } else {
    shoppingCartModel.addToCart(product);
  }

  cardPreviewView.buttonText = inCart ? 'Купить' : 'Удалить из корзины';
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
  orderFormView.submitButtonEnable(!errors.address && !errors.payment);
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
  contactFormView.submitButtonEnable(!errors.email && !errors.phone);
});

eventBroker.on('order:update', (data: { address?: string; payment?: TPayment }) => {
  buyerModel.update(data);
});

eventBroker.on('contacts:update', (data: { phone?: string; email?: string }) => {
  buyerModel.update(data);
})

eventBroker.on('buyer:update', () => {
  orderFormView.setAddress(buyerModel.getAddress() || '');
  orderFormView.setPaymentButtonActive(buyerModel.getPayment() || '');
  const orderValid = orderFormView.showErrors(buyerModel.validate());
  orderFormView.submitButtonEnable(orderValid);

  contactFormView.setEmail(buyerModel.getEmail() || '');
  contactFormView.setPhone(buyerModel.getPhone() || '');
  const contactsValid = contactFormView.showErrors(buyerModel.validate());
  contactFormView.submitButtonEnable(contactsValid);
});

eventBroker.on('success:show', async () => {
  try {
    const response = await api.postOrder(
      {
        payment: buyerModel.getPayment() as 'cash' | 'card',
        email: buyerModel.getEmail()!,
        phone: buyerModel.getPhone()!,
        address: buyerModel.getAddress()!,
        total: shoppingCartModel.getCartTotalPrice()!,
        items: shoppingCartModel.getCartItems().map((item: IProduct) => item.id)
      });
    successView.orderSuccessMessage = response.total;
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
