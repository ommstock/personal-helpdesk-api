import { IsEnum, IsNotEmpty } from 'class-validator';
import { TicketStatus } from '@prisma/client';

export class UpdateTicketStatusDto {
    @IsNotEmpty()
    @IsEnum(TicketStatus, { message: 'status must be a valid TicketStatus (OPEN, IN_PROGRESS, RESOLVED, CLOSED)' })
    status: TicketStatus;
}
