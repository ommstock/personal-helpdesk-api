import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { TicketPriority } from "@prisma/client";
import { IsEnum, IsString, MinLength, IsOptional, IsUUID } from "class-validator";

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

    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    categoryId?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsUUID()
    assigneeId?: string;
}