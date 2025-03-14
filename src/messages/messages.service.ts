import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class MessagesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getMessages(userId: string, contactId: string) {
    const supabase = this.supabaseService.getClient();
    console.log(`📩 Buscando mensajes entre ${userId} y ${contactId}`);
  
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(
        `and(sender_id.eq.${userId},receiver_id.eq.${contactId}),` +
        `and(sender_id.eq.${contactId},receiver_id.eq.${userId})`
      ) // ✅ Solo mensajes entre ambos usuarios
      .order('created_at', { ascending: true });
  
    if (error) throw new Error(error.message);
  
    console.log('✅ Mensajes encontrados:', data);
    return data;
  }         

  async sendMessage(senderId: string, receiverId: string, content: string) {
    if (!receiverId) throw new Error('El mensaje debe tener un destinatario');
  
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('messages')
      .insert([{ sender_id: senderId, receiver_id: receiverId, content }])
      .select('*');
  
    if (error) throw new Error(error.message);
    return data[0];
  }  
}
