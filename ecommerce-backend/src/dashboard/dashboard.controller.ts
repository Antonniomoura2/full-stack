import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('report')
  async getReport(@Query('slug') slug?: string) {
    return this.dashboardService.getReport(slug);
  }
}
