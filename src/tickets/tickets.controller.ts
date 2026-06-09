import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TicketsService } from './tickets.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role, TicketStatus } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { FilterTicketDto } from './dto/filter-ticket.dto';

@Controller('tickets')
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    create(
        @Body() dto: CreateTicketDto,
        @CurrentUser() user: any,
    ) {
        // console.log("USER", user);
        // Using user from JWT token (not from request body)
        return this.ticketsService.create(dto, user.id)
        // return 'OK';
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.SUPPORT)
    findAll(@CurrentUser() user: any, @Query() query: FilterTicketDto) {
        return this.ticketsService.findAll(query);
    }

    @Get('my')
    @UseGuards(JwtAuthGuard)
    findMyTickets(
        @CurrentUser() user: any,
    ) {
        return this.ticketsService.findByUser(user.id)
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    findOne(
        @Param('id') id: string,
        @CurrentUser() user: any,
    ) {
        return this.ticketsService.findOne(id, user)
    }

    @Patch(':id/status')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.SUPPORT)
    updateStatus(
        @Param('id') id: string,
        @Body() dto: { status: TicketStatus },
        @CurrentUser() user: any,
    ) {
        return this.ticketsService.updateStatus(id, dto.status, user.userId)
    }
}
