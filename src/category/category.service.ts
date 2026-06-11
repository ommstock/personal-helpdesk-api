import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {

    constructor(private prisma: PrismaService) { }

    async create(dto: CreateCategoryDto) {
        const exists = await this.prisma.category.findUnique({ where: { name: dto.name } });
        if (exists) throw new ConflictException("Category already exists");
        return this.prisma.category.create({ data: dto });
    }

    async getAll() {
        return this.prisma.category.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                _count: {
                    select: { tickets: true }
                }
            }
        });
    }

    async update(id: string, dto: UpdateCategoryDto) {
        const exists = await this.prisma.category.findUnique({ where: { id } });
        if (!exists) throw new NotFoundException("Category not found");

        if (dto.name && dto.name !== exists.name) {
            const nameConflict = await this.prisma.category.findUnique({ where: { name: dto.name } });
            if (nameConflict) throw new ConflictException("Category name already exists");
        }

        return this.prisma.category.update({ where: { id }, data: dto });
    }

    async delete(id: string) {
        const exists = await this.prisma.category.findUnique({ where: { id } });
        if (!exists) throw new NotFoundException("Category not found");
        return this.prisma.category.delete({ where: { id } });
    }
}
