import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  async getMessages(
    @Query('limit') limit: number = 20,
    @Query('offset') offset: number = 0
  ) {
    return this.messagesService.getMessages(limit, offset);
  }

  @Post()
  async sendMessage(@Body() body: { senderId: string; content: string }) {
    return this.messagesService.sendMessage(body.senderId, body.content);
  }
}
