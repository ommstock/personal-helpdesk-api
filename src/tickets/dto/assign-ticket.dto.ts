import { IsNotEmpty, IsUUID } from "class-validator";

export class AssignTicketDto {
    @IsUUID()
    @IsNotEmpty()
    userId: string;
}