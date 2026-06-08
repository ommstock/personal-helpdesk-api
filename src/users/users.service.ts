import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    create(data: CreateUserDto) {
        return this.prisma.user.create({ data, });
    }

    findAll() {
        return this.prisma.user.findMany();
    }

    findOne(id: string) {
        return this.prisma.user.findUnique({ where: { 'id': id } });
    }

    findByEmail(email: string) {
        return this.prisma.user.findUnique({ where: { email } });
    }

    remove(id: string) {
        return this.prisma.user.delete({ where: { id } });
    }

    update(id: string, data: CreateUserDto) {
        return this.prisma.user.update({ where: { id }, data });
    }

    findByName(name: string) {
        return this.prisma.user.findMany({ where: { name } });
    }

    getRole(id: string) {
        return this.prisma.user.findUnique({ where: { id }, select: { 'role': true } });
    }

    search(name: string) {
        return this.prisma.user.findMany({ where: { name } });
    }

    countAll() {
        return this.prisma.user.count();
    }

    countByName(name: string) {
        return this.prisma.user.count({ where: { name } });
    }
}
