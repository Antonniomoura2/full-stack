import { Product } from "./product.types";

export interface IOrder {
    _id: string;  
    productIds: string[] | Product[];
    total: number;
    date: string; 
  }

  export interface IOrderInitialValues {
    productIds: string[];
    total: number;
    date: string; 
  }
  