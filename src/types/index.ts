export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

// Типы способов оплаты у покупателя
export type TPayment = 'cash' | 'card' | '';

// Тип ошибок валидации формы
export type TFormErrors = Partial<Record<keyof IBuyer, string>>

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

// Интерфейс товара
export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

// Интерфейс покупателя
export interface IBuyer {
  payment?: TPayment;
  email?: string;
  phone?: string;
  address?: string;
}

// Интерфейс ответа API
export interface IApiProducts {
  total: number;
  items: IProduct[];
}
