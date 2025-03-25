import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type DailyReportDocument = DailyReport & Document;

@Schema({ collection: 'daily_reports' })
export class DailyReport {
  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: false })
  date?: Date;

  @Prop({ type: Array })
  topProducts: {
    productId: string;
    name: string;
    totalSold: number;
    price: number;
    imageUrl: string;
  }[];

  @Prop({ type: Array })
  topCategories: {
    categoryId: string;
    name: string;
    totalUsed: number;
  }[];

  @Prop({ type: Object })
  kpis: {
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    totalProductsSold: number;
    firstOrderDate: Date | null;
    lastOrderDate: Date | null;
    mostSoldProduct?: {
      name: string;
      price: number;
      sold: number;
    } | null;
  };
  
  @Prop()
  updatedAt: Date;
}

export const DailyReportSchema = SchemaFactory.createForClass(DailyReport);
