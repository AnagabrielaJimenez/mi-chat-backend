import { Controller, Get, Post, Query, Body, Req, UseGuards } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { AuthGuard } from '../auth/auth.guard'; // ✅ Middleware de autenticación
import { Request } from 'express';

@Controller('contacts')
@UseGuards(AuthGuard)
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  // ✅ Obtener la lista de contactos del usuario autenticado
  @Get()
  async getContacts(@Req() req: Request) {
    if (!req.user) {
      throw new Error('Usuario no autenticado'); // ❌ Maneja el caso donde req.user sea undefined
    }
    console.log('Usuario autenticado:', req.user);
    return this.contactsService.getContacts(req.user.id);
  }

  @Post()
  async addContact(@Req() req, @Body() body: { contactId: string }) {
    if (!req.user) {
      throw new Error('Usuario no autenticado');
    }
    return this.contactsService.addContact(req.user.id, body.contactId);
  }
  
  // ✅ Buscar contactos por nombre o correo
  @Get('search')
  async searchContacts(@Query('query') query: string) {
    return this.contactsService.searchContacts(query);
  }
}
