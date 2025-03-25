export interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
}

export interface NewProduct {
  name: string;
  description: string;
  categoryIds: string[];
  price: number;
  imageUrl: string;
}

export interface IProductInitialValue {
  name: string;
  description: string;
  price: number;
  categoryIds: string[];
  imageUrl: string;
}
