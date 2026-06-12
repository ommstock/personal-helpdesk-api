import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AssignRoleDto } from './dto/assign-role.dto';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    create(data: CreateUserDto) {
        return this.prisma.user.create({ data, omit: { password: true } });
    }

    findAll() {
        return this.prisma.user.findMany({ omit: { password: true } });
    }

    findOne(id: string) {
        return this.prisma.user.findUnique({ where: { id }, omit: { password: true } });
    }

    assignRole(dto: AssignRoleDto) {
        const user = this.prisma.user.findUnique({ where: { id: dto.userId } });
        if (!user) throw new NotFoundException("User not found");

        return this.prisma.user.update({ where: { id: dto.userId }, data: { role: dto.role } });
    }

    findByEmail(email: string) {
        return this.prisma.user.findUnique({ where: { email } });
    }

    remove(id: string) {
        return this.prisma.user.delete({ where: { id }, omit: { password: true } });
    }

    update(id: string, data: CreateUserDto) {
        return this.prisma.user.update({ where: { id }, data, omit: { password: true } });
    }

    findByName(name: string) {
        return this.prisma.user.findMany({ where: { name }, omit: { password: true } });
    }

    getRole(id: string) {
        return this.prisma.user.findUnique({ where: { id }, select: { 'role': true } });
    }

    search(name: string) {
        return this.prisma.user.findMany({ where: { name }, omit: { password: true } });
    }

    countAll() {
        return this.prisma.user.count();
    }

    countByName(name: string) {
        return this.prisma.user.count({ where: { name } });
    }
}
