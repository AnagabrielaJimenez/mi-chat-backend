import { Controller, Get, Param, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 🔹 Obtener usuario por ID
  @Get(':id')
  async getUser(@Param('id') id: string) {
    return await this.usersService.getUserById(id);
  }

  // 🔹 Buscar usuarios por nombre o correo
  @Get()
  async searchUsers(@Query('q') query: string) {
    return await this.usersService.searchUsers(query);
  }
}