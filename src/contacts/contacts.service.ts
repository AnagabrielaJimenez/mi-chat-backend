import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class ContactsService {
  constructor(private readonly supabaseService: SupabaseService) {}

  // ✅ Obtener la lista de contactos del usuario autenticado
  async getContacts(userId: string) {
    const supabase = this.supabaseService.getClient();
    
    // 🟢 Obtener los contactos del usuario sin duplicarlos
    const { data: contacts, error: contactsError } = await supabase
      .from('contacts')
      .select('*')
      .or(`user_id.eq.${userId},contact_id.eq.${userId}`)
      .order('created_at', { ascending: false });
  
    if (contactsError) throw new Error(contactsError.message);
    
    if (!contacts.length) return [];
  
    // 🟢 Filtrar para evitar contactos duplicados
    const contactPairs = new Set();
    const uniqueContacts = contacts.filter(contact => {
      const pairKey = [contact.user_id, contact.contact_id].sort().join('-');
      if (contactPairs.has(pairKey)) return false;
      contactPairs.add(pairKey);
      return true;
    });
  
    // 🟢 Obtener la información de los contactos desde la tabla users
    const contactIds = [
      ...new Set(uniqueContacts.flatMap(contact => [contact.user_id, contact.contact_id]))
    ].filter(id => id !== userId); // ✅ Evitar incluir al propio usuario
  
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, full_name, email, avatar_url')
      .in('id', contactIds);
  
    if (usersError) throw new Error(usersError.message);
  
    // 🟢 Unir los datos
    return uniqueContacts.map(contact => ({
      ...contact,
      contactUser: users.find(user => user.id === (contact.user_id === userId ? contact.contact_id : contact.user_id)) || null
    }));
  }  

  // ✅ Agregar un nuevo contacto
  async addContact(userId: string, contactId: string | null) {
    if (!contactId) throw new Error('contact_id no puede ser null');
  
    const supabase = this.supabaseService.getClient();
    
    // 🟢 Verificar si ya existe la relación
    const { data: existingContact } = await supabase
      .from('contacts')
      .select('*')
      .or(`(user_id.eq.${userId},contact_id.eq.${contactId}),(user_id.eq.${contactId},contact_id.eq.${userId})`)
      .single();
  
    if (existingContact) throw new Error('Este contacto ya existe');
  
    // 🟢 Insertar la relación de contacto
    const { data, error } = await supabase
      .from('contacts')
      .insert([{ user_id: userId, contact_id: contactId, status: 'pending' }])
      .select('*');
  
    if (error) throw new Error(error.message);
    return data[0];
  }  

  // ✅ Actualizar el estado del contacto (aceptar o rechazar)
  async updateContactStatus(id: string, status: string) {
    if (!['accepted', 'rejected'].includes(status)) {
      throw new Error('Estado no válido');
    }

    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('contacts')
      .update({ status })
      .eq('id', id)
      .select('*');

    if (error) throw new Error(error.message);
    return data[0];
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
