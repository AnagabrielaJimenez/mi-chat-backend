import { Controller, Get, Post, Put, Query, Body, Req, Param, UseGuards } from '@nestjs/common';
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
      throw new Error('Usuario no autenticado');
    }
    return this.contactsService.getContacts(req.user.id);
  }

  // ✅ Agregar un nuevo contacto
  @Post()
  async addContact(@Req() req, @Body() body: any) {
    if (!req.user) {
        throw new Error('Usuario no autenticado');
    }

    const contactId = body.contact_id; // ✅ Asegurar que se extrae correctamente

    if (!contactId) {
        throw new Error('El campo contact_id es obligatorio');
    }

    return this.contactsService.addContact(req.user.id, contactId);
  }


  // ✅ Actualizar estado del contacto (aceptar/rechazar)
  @Put(':id')
  async updateContact(@Param('id') id: string, @Body() body: { status: string }) {
    return this.contactsService.updateContactStatus(id, body.status);
  }

  // ✅ Buscar contactos por nombre o correo
  @Get('search')
  async searchContacts(@Query('query') query: string) {
    return this.contactsService.searchContacts(query);
  }
}
