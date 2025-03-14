import { Controller, Get, Post, Put, Body, Param, Query, Headers } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 🔹 Endpoint para registrar usuarios en la tabla "users"
  @Post()
  async createUser(
    @Body() body: { id: string; email: string; full_name: string; avatar_url: string },
    @Headers('Authorization') authToken: string
  ) {
    if (!authToken) {
      throw new Error('Token no proporcionado');
    }
    return this.usersService.createUser(body.id, body.email, body.full_name, body.avatar_url);
  }

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

  // 🔹 **Actualizar usuario (nombre y avatar)** ✅ NUEVO
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() body: { full_name: string; avatar_url: string },
    @Headers('Authorization') authToken: string
  ) {
    if (!authToken) {
      throw new Error('Token no proporcionado');
    }
    return await this.usersService.updateUser(id, body.full_name, body.avatar_url);
  }
}
