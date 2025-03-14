import { Controller, Get, Post, Body, Req, UseGuards, Query } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { AuthGuard } from '../auth/auth.guard';
import { Request } from 'express';

@Controller('messages')
@UseGuards(AuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  async getMessages(@Req() req: Request, @Query('userId') userId: string, @Query('contactId') contactId: string) {
    if (!req.user) {
      throw new Error('❌ Usuario no autenticado');
    }

    console.log(`📩 Buscando mensajes entre ${userId} y ${contactId}`);
    return this.messagesService.getMessages(userId, contactId);
  }

  @Post()
  async sendMessage(
    @Req() req, // ✅ Obtenemos el usuario autenticado
    @Body() body: { receiverId: string; content: string }
  ) {
    if (!req.user) {
      throw new Error('❌ Usuario no autenticado'); // ⚠️ Esto se activa si `AuthGuard` no pasa correctamente
    }

    console.log('📌 Usuario autenticado:', req.user); // 🟢 Debug

    return this.messagesService.sendMessage(req.user.id, body.receiverId, body.content);
  }
}
