import { Controller, Get, HttpCode, UseGuards, UseInterceptors, } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { DashboardService } from './dashboard.service';

@ApiTags('dashboard')
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }


    @Get("summary")
    @HttpCode(200)
    @ApiBearerAuth()
    getDashboardSummary() {
        return this.dashboardService.getDashboardSummary();
    }

    @Get("statistics_by_priority")
    @HttpCode(200)
    @ApiBearerAuth()
    getStatisticsByPriority() {
        return this.dashboardService.getStatisticsByPriority();
    }

    @Get("statistics_by_category")
    @HttpCode(200)
    @ApiBearerAuth()
    getStatisticsByCategory() {
        return this.dashboardService.getStatisticsByCategory();
    }
}
