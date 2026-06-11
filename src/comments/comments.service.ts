import { ForbiddenException, Injectable, NotFoundException, Post } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from 'src/tickets/dto/create-comment.dto';
import { Role } from '@prisma/client';

@Injectable()
export class CommentsService {
    constructor(private readonly prisma: PrismaService) { }

    async addComment(ticketId: string, dto: CreateCommentDto, userId: string) {
        const ticket = await this.prisma.ticket.findUnique({ where: { id: ticketId } })
        if (!ticket) throw new NotFoundException("Ticket not found");

        const user = await this.prisma.user.findUnique({ where: { id: userId } })
        if (!user) throw new NotFoundException("Error obtaining user");

        if (userId !== ticket.userId && user.role !== Role.ADMIN && user.role !== Role.SUPPORT)
            throw new ForbiddenException("You don't have permission to comment on this ticket");

        const comment = await this.prisma.comment.create({
            data: {
                ...dto,
                userId,
                ticketId
            }
        });

        return comment;
        // return this.prisma.comment.findUnique({
        //     where: { id: comment.id },
        //     include: {
        //         user: {
        //             select: {
        //                 id: true,
        //                 name: true,
        //                 email: true,
        //             }
        //         }
        //     }
        // });
    }

    async getCommentsByTicket(ticketId: string, userId: string) {
        const ticket = await this.prisma.ticket.findUnique({ where: { id: ticketId } });
        if (!ticket) throw new NotFoundException("Ticket not found");

        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user) throw new NotFoundException("Error obtaining user");

        if (userId !== ticket.userId && user.role !== Role.ADMIN && user.role !== Role.SUPPORT)
            throw new ForbiddenException("You don't have permission to view comments on this ticket");

        const comments = await this.prisma.comment.findMany({
            where: { ticketId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                }
            }
        });

        return comments;
    }

}
