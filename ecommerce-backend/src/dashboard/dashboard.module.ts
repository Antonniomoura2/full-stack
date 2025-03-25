import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DailyReport, DailyReportSchema } from './schemas/daily-report.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DailyReport.name, schema: DailyReportSchema }
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService]
})
export class DashboardModule {}
