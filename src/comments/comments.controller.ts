import { Body, Controller, Get, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { CreateCommentDto } from 'src/tickets/dto/create-comment.dto';

@Controller('tickets/:ticketId/comments')
export class CommentsController {
    constructor(private readonly commentsService: CommentsService) { }

    @Post()
    @UseGuards(JwtAuthGuard)
    addComment(
        @Param("ticketId", ParseUUIDPipe) ticketId: string,
        @Body() dto: CreateCommentDto,
        @CurrentUser() user: any,
    ) {
        return this.commentsService.addComment(ticketId, dto, user.id);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    getComments(
        @Param("ticketId", ParseUUIDPipe) ticketId: string,
        @CurrentUser() user: any,
    ) {
        return this.commentsService.getCommentsByTicket(ticketId, user.id);
    }
}

// @Controller('comments')
// export class CommentsController {}