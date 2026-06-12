import { IsEnum, IsNotEmpty, IsUUID } from "class-validator";
import { Role } from "@prisma/client";
import { ApiProperty } from "@nestjs/swagger";

export class AssignRoleDto {
    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    userId: string;

    @ApiProperty()
    @IsEnum(Role)
    @IsNotEmpty()
    role: Role;
}