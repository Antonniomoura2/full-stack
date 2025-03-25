import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DailyReport, DailyReportDocument } from './schemas/daily-report.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(DailyReport.name) private reportModel: Model<DailyReportDocument>,
  ) {}

  async getReport(slug?: string): Promise<DailyReport> {
    const finalSlug = slug || new Date().toISOString().split('T')[0];
    const report = await this.reportModel.findOne({ slug: finalSlug }).exec();

    return (
      report ?? {
        slug: finalSlug,
        date: new Date(finalSlug),
        topProducts: [],
        topCategories: [],
        kpis: {
          totalOrders: 0,
          totalRevenue: 0,
          averageOrderValue: 0,
          totalProductsSold: 0,
          firstOrderDate: null,
          lastOrderDate: null,
          mostSoldProduct: null,
        },
        updatedAt: null,
      } as unknown as DailyReport
    );
  }
}
