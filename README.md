# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```

## Сборка

```
npm run build
```

или

```
yarn build
```

# Интернет-магазин «Web-Larёk»

«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component

Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`

#### Класс Api

Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter

Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` - хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, 

## Данные

#### Товар

```typescript
interface IProduct {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;
}
```

- `id` - id товара
- `description` - описание товара
- `image` - изображение товара
- `title` - заголовок товара
- `category` - категория товара
- `price` - стоимость товара, значение `null` - нет цены

#### Покупатель

```typescript
interface IBuyer {
    payment: TPayment;
    email: string;
    phone: string;
    address: string;
}
```

- `payment` - способ оплаты, `card | cash`
- `email` - почта покупателя
- `phone` - телефон покупателя
- `address` - адрес доставки

### Модели данных

#### Каталог `Products`

Отображает товары.

Свойства:

- `_allProducts: IProduct[]` - массив товаров
- `_checkItem: IProduct[] | null = null` - выделенный товар для отображения в окне

Методы:

- `setItems(apiProducts: IProduct[]) : void` - сохраняет товары
- `getItems() : IProduct[]` - получает массив товары
- `getItemById(id: string) : IProduct[] | undefined` - получает товар по `id`
- `setCheckItemById(id: string) : boolean` - устанавливает товар для подробного отображения
- `deleteCheckItemById() : boolean` - убирает товар для подробного отображения
- `getCheckItem() : IProduct | null` - получает товар для подробного отображения

#### Корзина `ShoppingCart`

Отображается список выбранных покупателем товаров.

Свойства:

- `_cartItems: IProduct[] = []` - массив товаров, добавленных в корзину

Методы:

- `getCartItems() : IProduct[]` - получение массива товаров, которые находятся в корзине
- `addToCart(product: IProduct) : void` - добавление товара
- `removeItemFromCart(product: IProduct) : void` - удаление товара
- `removeAllItemsFromCart() : void` - очистка корзины
- `getCartTotalPrice() : number` - получение стоимости всех товаров в корзине
- `getCartTotalQuantity() : number ` - получение количества товаров в корзине
- `checkItemInCart(id: string) : boolean` - проверка наличия товара в корзине по его `id`

#### Покупатель `Buyer`

Данные покупателя, необходимые для оформления заказа.

Свойства:

- `payment?: TPayment` — способ оплаты, изменить через `buyer.payment = ...`
- `address?: string` — адрес доставки, изменить через `buyer.address = ...`
- `phone?: string` — телефон покупателя, изменить через `buyer.phone = ...`
- `email?: string` — почта покупателя, изменить через `buyer.email = ...`

Методы:

- `update(date: Partial<IBuyer>): void` - частичное обновление данных
- `validate(): IErrors | undefined` - проверка данных покупателя
- `clear(): void` - очищает данные покупателя

### Слой коммуникации `LarekApi`

Конструктор:

- `constuctor(api: IApi)` - в конструктор передается экземпляр класса, соответсвующий интерфейсу `IApi`

Методы класса:

- `get(): Promise<IApiProducts>` - получает с сервера объект с массивом товаров
- `post(data: TOrder) : Promise<TOrderResponse>` - отправляет на сервер данные о покупателе и выбранных
  товарах

### Представление

Все классы представления наследуются от родительского класса `Component`.

#### `Header`

**Назначение:** шапка сайта с кнопкой корзины.  
**Конструктор:**  
`constructor(container: HTMLElement, event: IEvents)`  
— принимает контейнер и брокер событий, навешивает обработчик клика на кнопку корзины.

**Свойства:**

- `headerBasket` — кнопка корзины
- `headerBasketCounter` — счетчик количества товаров

**Методы:**

- `set counter(value: number)` — обновляет число товаров рядом с иконкой корзины

#### `Modal`

**Назначение:** диалоговое окно для отображения контента.  
**Конструктор:**  
`constructor(container: HTMLElement)` — принимает контейнер.

**Свойства:**

- `closeBtn` — кнопка закрытия диалогового окна
- `content` — область для вставки контента

**Методы:**

- `setContent(content: HTMLElement)` - контейнер для отображения контента
- `open(content: HTMLElement)` — открывает диалоговое окно и устанавливает обработчики события на закрытие окна по клику вне области
  содержимого окна
- `close()` — закрывает диалоговое окно и удаляет обработчики события

#### `Gallery`

**Назначение:** контейнер для карточек товаров.  
**Конструктор:**  
`constructor(container: HTMLElement)` — задает контейнер.

**Методы:**

- `set renderedCards(cards: HTMLElement[])` — вставляет карточки товаров в контейнер

#### `CardBase`

**Назначение:** Базовый класс карточки товара.  
**Конструктор:**  
`constructor(container: HTMLElement)` — принимает контейнер.

**Свойства:**

- `cardTitle: HTMLElement` — заголовок товара
- `cardPrice: HTMLElement` — цена товара

**Методы:**

- `set title(value: string)` — устанавливает название
- `set price(value: number | null)` — устанавливает цену

#### `CardBasket`

**Назначение:** Карточки товара в корзине. `Card <- CardBasket`  
**Конструктор:**  
`constructor(container: HTMLElement, private action?: ICardAction) ` — принимает контейнер и объект событий

**Свойства:**

- `indexItem: HTMLElement` — порядковый номер в корзине
- `clickableEl: HTMLButtonElement` — кнопка удаления товара из корзины

**Методы:**

- `set index(value: number)` — устанавливает порядковый номер

#### `CardCatalog`

**Назначение:** Карточки товара в каталоге. `CardView <- CardCatalog`  
**Конструктор:**  
`constructor(container: HTMLElement, private action?: ICardAction) ` — принимает контейнер и объект событий

**Свойства:**

- `cardCategory: HTMLElement` — категория товара
- `cardImage: HTMLImageElement` — изображение товара
- `clickableEl` — слушатель клика на карточку

**Методы:**

- `category(value: string) ` — задает категорию и соответствующий модификатор
- `set image(value: string)` — устанавливает адрес изображения товара

#### `CardPreview`

**Назначение:** Карточки товара в каталоге. `CardView <- CardPreview`  
**Конструктор:**  
`constructor(container: HTMLElement, private event: IEvents) ` — принимает контейнер и объект событий

**Свойства:**

- `cardCategory: HTMLElement` — категория товара
- `cardImage: HTMLElement` — изображение товара
- `cardText: HTMLElement` — описание товара
- `clickableEl: HTMLElement` — кнопка добавления или удаления товара из корзины

**Методы:**

- `set buttonDisabled(value: boolean)` — блокирует кнопку добавления в корзину, если товар уже в корзине
- `set buttonText(value: string)` — устанавливает текст кнопки
- `set description(value: string)` — устанавливает описание товара
- `set category(value: string)` — задает категорию и соответствующий модификатор
- `set image(value: string) ` — устанавливает адрес изображения товара

#### `Basket`

**Назначение:** Корзина.  
**Конструктор:**  
`constructor(container: HTMLElement, private events: IEvents)` — принимает контейнер и брокер событий.

**Свойства:**

- `basketList` — контейнер для отображения списка товаров
- `basketButton` — кнопка оформления товаров из корзины
- `basketPrice` — итоговая сумма

**Методы:**

- `set totalPrice(value: number)` — обновляет итоговую сумму
- `set buttonOrder(enabled: boolean)` - делает доступной кнопку
- `set renderedCards(cards: HTMLElement[])` — выводит список товаров

#### `Form`

**Назначение:** Базовый класс формы.  
**Конструктор:**  
`constructor(container: HTMLElement) ` — принимает контейнер и объект с действиями

**Свойства:**

- `formErrors: HTMLElement` — элемент для вывода ошибки
- `submitButton: HTMLButtonElement` — кнопка отправки формы

**Методы:**

- `showErrors(errors: Partial<TFormErrors>)` — устанавливает ошибку
- `submitButtonEnable(enabled: boolean)` — переключатель доступности кнопки 

#### `OrderForm`

**Назначение:** Первый шаг оформления заказа. `FormView <- OrderForm`  
**Конструктор:**  
`constructor(container: HTMLElement, private event: IEvents)` — принимает контейнер и брокер событий

**Свойства:**

- `paymentButtons: HTMLButtonElement[]` — кнопки выбора способа оплаты
- `addressInput: HTMLInputElement;` — инпут ввода адреса

**Методы:**

- `setPaymentButtonActive(payment: TPayment)` — делает активной кнопку выбора оплаты
- `setAddress(value: string)` — заполняет инпут с адресом

#### `ContactsForm`

**Назначение:** Второй шаг оформления заказа. `FormView <- ContactsForm`  
**Конструктор:**  
`constructor(container: HTMLElement, private event: IEvents)` — принимает контейнер и брокер событий

**Свойства:**

- `emailInput: HTMLInputElement` — инпут ввода почты
- `phoneInput: HTMLInputElement` — инпут ввода телефона

**Методы:**

- `setEmail(value: string)` — заполняет инпут с почтой
- `setPhone(value: string)` — заполняет инпут с телефоном

#### `OrderSuccess`

**Назначение:** Сообщение об успешной оплате  
**Конструктор:**  
`constructor(container: HTMLElement, private event: IEvents) ` — принимает контейнер и брокер событий

**Свойства:**

- `orderSuccessDescription: HTMLElement` — элемент отображает, на какую сумму был оформлен заказ
- `orderSuccessClose: HTMLButtonElement` — кнопка закрытия

**Методы:**

- `set orderSuccessMessage(value: number)` — устанавливает общую сумму заказа