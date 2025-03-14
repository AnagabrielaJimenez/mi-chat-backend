import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class MessagesService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async getMessages(limit: number = 20, offset: number = 0) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) throw new Error(error.message);
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
