import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    name: string;

    @IsString()
    @IsOptional()
    description?: string;
}