import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TicketPriority, TicketStatus } from '@prisma/client';
import { FilterTicketDto } from './dto/filter-ticket.dto';
import { PaginatedResponseDto } from 'src/common/dto/paginated-response.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuditAction, EntityType } from 'src/common/enums/audit.enum';

@Injectable()
export class TicketsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly eventEmitter: EventEmitter2,
    ) { }

    private emitAuditLog(action: AuditAction, entityId: string, actorId: string) {
        if (actorId) {
            this.eventEmitter.emit('audit.log.record', {
                action,
                entity: EntityType.TICKET,
                entityId,
                userId: actorId,
            });
        }
    }

    async create(
        dto: CreateTicketDto,
        userId: string,
    ) {
        const ticket = await this.prisma.ticket.create({
            data: { ...dto, userId }
        });
        this.emitAuditLog(AuditAction.CREATE, ticket.id, userId);
        return ticket;
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

    async updateStatus(ticketId: string, status: TicketStatus, userId: string) {
        const ticket = await this.prisma.ticket.update({
            where: { id: ticketId },
            data: {
                status,
                // resolvedBy: userId, TODO
            },
        });
        this.emitAuditLog(AuditAction.UPDATE_TICKET_STATUS, ticket.id, userId);
        return ticket;
    }

    async update(id: string, dto: CreateTicketDto, actorId: string) {
        const ticket = await this.prisma.ticket.update({
            where: { id },
            data: dto,
        });
        this.emitAuditLog(AuditAction.UPDATE, ticket.id, actorId);
        return ticket;
    }

    async remove(id: string, actorId: string) {
        const ticket = await this.prisma.ticket.delete({
            where: { id },
        });
        this.emitAuditLog(AuditAction.DELETE, ticket.id, actorId);
        return ticket;
    }

    async assignTicket(ticketId: string, assignedId: string, actorId: string) {
        const ticketExists = await this.prisma.ticket.findUnique({ where: { id: ticketId } })
        if (!ticketExists) throw new NotFoundException("Ticket not found");

        const user = await this.prisma.user.findUnique({ where: { id: assignedId } })
        if (!user) throw new NotFoundException("User not found")

        const ticket = await this.prisma.ticket.update({
            where: { id: ticketId },
            data: {
                assignedToId: assignedId,
            }
        });
        this.emitAuditLog(AuditAction.ASSIGN_TICKET, ticket.id, actorId);
        return ticket;
    }
}
