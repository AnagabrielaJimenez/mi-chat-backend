import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class ContactsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  // ✅ Obtener la lista de contactos del usuario autenticado
  async getContacts(userId: string) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('contacts')
      .select('contact_id, users(full_name, email, avatar_url)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }

  // ✅ Agregar un nuevo contacto
  async addContact(userId: string, contactId: string) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('contacts')
      .insert([{ user_id: userId, contact_id: contactId }])
      .select('*');

    if (error) throw new Error(error.message);
    return data;
  }

  // ✅ Buscar contactos por nombre o correo
  async searchContacts(query: string) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('users')
      .select('id, full_name, email, avatar_url')
      .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
      .limit(10);

    if (error) throw new Error(error.message);
    return data;
  }
}