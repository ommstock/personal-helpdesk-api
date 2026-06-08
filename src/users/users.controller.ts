import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    create(@Body() dto: CreateUserDto) {
        return this.usersService.create(dto);
    }

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Get('profile')
    @UseGuards(AuthGuard('jwt'))
    getProfile(@CurrentUser() user: any) {
        return user;
    }

    // @Get(':id')
    // findOne(@Param('id') id: string) {
    //     return this.usersService.findOne(id);
    // }

    // @Delete(':id')
    // delete(@Param('id') id: string) {
    //     return this.usersService.remove(id);
    // }

    // @Put(':id')
    // update(@Param('id') id: string, @Body() dto: CreateUserDto) {
    //     return this.usersService.update(id, dto);
    // }

    // @Get(':id/role')
    // getRole(@Param('id') id: string) {
    //     return this.usersService.getRole(id);
    // }

    // @Get(':name')
    // findByName(@Param('name') name: string) {
    //     return this.usersService.findByName(name);
    // }

    // @Get(':name/count')
    // countByName(@Param('name') name: string) {
    //     return this.usersService.countByName(name);
    // }
    // @Get('search/:name')
    // search(@Param('name') name: string) {
    //     return this.usersService.search(name);
    // }
    // @Get('count/all')
    // countAll() {
    //     return this.usersService.countAll();
    // }
}
