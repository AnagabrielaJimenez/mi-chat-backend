import { Controller, Get, Res, Post, Body, Query } from '@nestjs/common';
import { Response } from 'express';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('stream')
  streamMessages(@Res() res: Response) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    this.messagesService.subscribe((message) => {
      res.write(`data: ${JSON.stringify(message)}\n\n`);
    });
  }

  @Post()
  async sendMessage(@Body() body: { senderId: string; content: string }) {
    return this.messagesService.sendMessage(body.senderId, body.content);
  }
}
