import './scss/styles.scss';
import { Api } from "./components/base/Api.ts";
import { Products } from './components/models/product-list.ts';
import { ShoppingCart } from './components/models/shopping-cart.ts';
import { Buyer } from './components/models/buyer.ts';
import { apiProducts } from './utils/data.ts';
import { Product } from './components/models/product.ts';
import {API_URL} from "./utils/constants.ts";
import {IApiProducts} from "./types";

// ========== Инициализация моделей ==========
const productsModel = new Products();
const shoppingCart = new ShoppingCart();
const buyer = new Buyer();
const api = new Api(API_URL);

// ========== 🧱 Модель Products ==========
console.group('🧱 Модель Products');

// Сохраняем массив товаров в модели Products
productsModel.setItems(apiProducts);

console.log('Массив товаров из каталога:', productsModel.getItems());

const idSelected = apiProducts.items[0].id;
const selectedProduct: Product | undefined = productsModel.getItemById(idSelected);
console.log(
  selectedProduct && selectedProduct.id === idSelected
    ? `Метод получения товара по ID ${idSelected} работает корректно`
    : `Объект Product не содержит продукта с ID: ${idSelected}`
);

const idCheck = apiProducts.items[1].id;
console.log(
  productsModel.setCheckItemById(idCheck)
    ? `Товар с ID ${idCheck} отмечен для подробного отображения`
    : `Товар с ID ${idCheck} не был отмечен для отображения`
);

console.log(
  productsModel.deleteCheckItem()
    ? `Товар был удалён из подробного отображения`
    : `Товар не был удалён из подробного отображения`
);

console.groupEnd();

// ========== 🗑️ Модель ShoppingCart ==========
console.group('🗑️ Модель ShoppingCart');

// Добавляем все товары из apiProducts с проверкой цены
apiProducts.items.forEach(item => {
  if (item.price != null) {
    shoppingCart.addToCart(item);
  } else {
    console.warn(`Товар ${item.title} не добавлен в корзину — отсутствует цена`);
  }
});

console.log('Массив товаров добавленных в корзину:', shoppingCart.getCartItems());
console.log('Стоимость корзины:', shoppingCart.getCartTotalPrice());
console.log('Количество товаров в корзине:', shoppingCart.getCartTotalQuantity());

const cartItem = shoppingCart.getCartItems()[0];
console.log(
  shoppingCart.checkItemInCart(cartItem.id)
    ? `Товар ${cartItem.id} есть в корзине`
    : `Товара ${cartItem.id} нет в корзине`
);

console.log('Товар был удалён:', shoppingCart.removeItemFromCart(cartItem));
console.log('Оставшиеся товары в корзине:', shoppingCart.getCartItems());

shoppingCart.removeAllItemsFromCart();
console.log('Корзина очищена:', shoppingCart.getCartItems());

console.groupEnd();

// ========== 🧑 Модель Buyer ==========
console.group('🧑 Модель Buyer');

// Создание покупателя с неполными данными
buyer.update({ payment: 'card' });
console.log('Создан покупатель с данными:', buyer);

let errors = buyer.validate();
if (errors && Object.keys(errors).length) console.warn('Ошибки валидации:', errors);

buyer.update({ email: 'mail@mail.com', phone: '+123456789' });
console.log('Обновлённые данные покупателя:', buyer);

errors = buyer.validate();
if (errors && Object.keys(errors).length) console.warn('Ошибки валидации после обновления:', errors);

buyer.address = 'Простоквашино';
console.log('После добавления адреса:', buyer);

errors = buyer.validate();
if (errors && Object.keys(errors).length) console.warn('Ошибки финальной валидации:', errors);
else console.log('Покупатель полностью валиден');

buyer.clear();

console.groupEnd();

// Тестируем работу с API
// ========== 📊 Модель Api ==========
console.group('========== 📊 Модель Api ==========');
const products: IApiProducts = await api.get('/product/');
console.log('Данные полученные с API', products)

