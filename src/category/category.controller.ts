import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    createCategory(@Body() dto: CreateCategoryDto) {
        return this.categoryService.create(dto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    getAllCategories() {
        return this.categoryService.getAll();
    }

    @Patch(":id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    updateCategory(@Param("id", ParseUUIDPipe) id: string, @Body() dto: UpdateCategoryDto) {
        return this.categoryService.update(id, dto);
    }

    @Delete(":id")
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    deleteCategory(@Param("id", ParseUUIDPipe) id: string) {
        return this.categoryService.delete(id);
    }

}
