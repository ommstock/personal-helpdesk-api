import { Injectable } from '@nestjs/common';
import { TicketPriority, TicketStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {
    constructor(private readonly prisma: PrismaService) { }

    async getDashboardSummary() {
        const [totalTickets, statusCounts] = await Promise.all([
            this.prisma.ticket.count(),
            this.prisma.ticket.groupBy({
                by: ['status'],
                _count: { _all: true },
            })
        ]);

        const summary = {
            totalTickets,
            openTickets: 0,
            inProgressTickets: 0,
            resolvedTickets: 0,
            closedTickets: 0,
        };

        statusCounts.forEach((item) => {
            if (item.status === TicketStatus.OPEN) summary.openTickets = item._count._all;
            if (item.status === TicketStatus.IN_PROGRESS) summary.inProgressTickets = item._count._all;
            if (item.status === TicketStatus.RESOLVED) summary.resolvedTickets = item._count._all;
            if (item.status === TicketStatus.CLOSED) summary.closedTickets = item._count._all;
        });

        return summary;
    }

    async getStatisticsByPriority() {
        const priorityCounts = await this.prisma.ticket.groupBy({
            by: ['priority'],
            _count: { _all: true },
        });

        const summary = {
            LOW: 0,
            MEDIUM: 0,
            HIGH: 0,
            CRITICAL: 0,
        };

        priorityCounts.forEach((item) => {
            if (item.priority === TicketPriority.LOW) summary.LOW = item._count._all;
            if (item.priority === TicketPriority.MEDIUM) summary.MEDIUM = item._count._all;
            if (item.priority === TicketPriority.HIGH) summary.HIGH = item._count._all;
            if (item.priority === TicketPriority.CRITICAL) summary.CRITICAL = item._count._all;
        });

        return summary;
    }

    async getStatisticsByCategory() {
        const [totalTickets, categories] = await Promise.all([
            this.prisma.ticket.count(),
            this.prisma.category.findMany({
                select: {
                    name: true,
                    _count: {
                        select: { tickets: true }
                    }
                }
            })
        ]);

        const result: Record<string, number> = {
            totalTickets,
        };

        categories.forEach((category) => {
            result[category.name] = category._count.tickets;
        });

        return result;
    }
}
