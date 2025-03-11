import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class ContactsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  // ✅ Obtener la lista de contactos del usuario autenticado
  async getContacts(userId: string) {
    const supabase = this.supabaseService.getClient();
    
    // 🟢 Obtener los contactos del usuario
    const { data: contacts, error: contactsError } = await supabase
      .from('contacts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
  
    if (contactsError) throw new Error(contactsError.message);
    
    if (contacts.length === 0) return [];
  
    // 🟢 Obtener la información de los contactos desde la tabla users
    const contactIds = contacts.map(contact => contact.contact_id);
    
    const { data: users, error: usersError } = await supabase
      .from('users')  // 🟢 Cambiado a 'users' en lugar de 'auth.users'
      .select('id, full_name, email, avatar_url')
      .in('id', contactIds);
  
    if (usersError) throw new Error(usersError.message);
  
    // 🟢 Unir los datos
    return contacts.map(contact => ({
      ...contact,
      contactUser: users.find(user => user.id === contact.contact_id) || null
    }));
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