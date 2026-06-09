import { IsEnum, IsIn, IsOptional, IsString } from 'class-validator';
import { TicketPriority, TicketStatus } from '@prisma/client';
import { BaseQueryDto } from 'src/common/dto/base-query.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterTicketDto extends BaseQueryDto {
  @ApiPropertyOptional({ enum: TicketStatus })
  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;

  @ApiPropertyOptional({ enum: TicketPriority })
  @IsOptional()
  @IsEnum(TicketPriority)
  priority?: TicketPriority;

  @ApiPropertyOptional({ description: 'Search tickets by title or description' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: ['createdAt', 'title', 'status', 'priority'], description: 'Field to sort by' })
  @IsOptional()
  @IsIn(['createdAt', 'title', 'status', 'priority'])
  declare sortBy?: string;
}
