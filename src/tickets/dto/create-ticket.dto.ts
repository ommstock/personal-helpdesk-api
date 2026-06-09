import { ApiProperty } from "@nestjs/swagger";
import { TicketPriority } from "@prisma/client";
import { IsEnum, IsString, MinLength } from "class-validator";

export class CreateTicketDto {
    @ApiProperty()
    @IsString()
    @MinLength(5)
    title: string;

    @ApiProperty()
    @IsString()
    @MinLength(10)
    description: string;

    @ApiProperty()
    @IsEnum(TicketPriority)
    priority: TicketPriority;
}