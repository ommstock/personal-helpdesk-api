import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TicketPriority, TicketStatus } from '@prisma/client';
import { FilterTicketDto } from './dto/filter-ticket.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';

@Injectable()
export class TicketsService {
    constructor(private readonly prisma: PrismaService) { }
    async create(
        dto: CreateTicketDto,
        userId: string,
    ) {
        // console.log(userId);
        return this.prisma.ticket.create({
            data: { ...dto, userId }
        })
    }

    async findByUser(userId: string) {
        return this.prisma.ticket.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        })
    }

    async findAll(query: FilterTicketDto) {
        const filter: any = {};
        if (query.status) filter.status = query.status;
        if (query.priority) filter.priority = query.priority;

        if (query.search) {
            filter.OR = [
                { title: { contains: query.search, mode: 'insensitive' } },
                { description: { contains: query.search, mode: 'insensitive' } },
            ];
        }

        const page = query.page || 1;
        const limit = query.limit || 10;
        const skip = (page - 1) * limit;

        const orderBy: any = {};
        if (query.sortBy) {
            orderBy[query.sortBy] = query.order || 'desc';
        } else {
            orderBy.createdAt = query.order || 'desc';
        }

        const [data, total] = await Promise.all([
            this.prisma.ticket.findMany({
                where: filter,
                orderBy,
                skip,
                take: limit,
            }),
            this.prisma.ticket.count({ where: filter }),
        ]);

        return new PaginatedResponseDto(data, total, page, limit);
    }

    async findOne(id: string, user: any) {
        const ticket = await this.prisma.ticket.findUnique({
            where: { id }
        });

        if (!ticket) {
            throw new NotFoundException(`Ticket with ID ${id} not found`);
        }

        // Ownership and Role Validation
        if (ticket.userId !== user.id && user.role !== Role.ADMIN && user.role !== Role.SUPPORT) {
            throw new ForbiddenException('You do not have permission to view this ticket');
        }

        return ticket;
    }

    async updateStatus(id: string, status: TicketStatus, userId: string) {
        return this.prisma.ticket.update({
            where: { id },
            data: {
                status,
                // resolvedBy: userId, TODO
            },
        })
    }

    async update(id: string, dto: CreateTicketDto) {
        return this.prisma.ticket.update({
            where: { id },
            data: dto,
        })
    }

    async remove(id: string) {
        return this.prisma.ticket.delete({
            where: { id },
        })
    }
}
