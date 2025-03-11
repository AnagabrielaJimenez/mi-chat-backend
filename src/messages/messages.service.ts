import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class MessagesService {
  private subscribers: ((message: any) => void)[] = [];

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

  async sendMessage(senderId: string, content: string) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('messages')
      .insert([{ sender_id: senderId, content }])
      .select('*');

    if (error) throw new Error(error.message);

    // ✅ Notificar a los suscriptores del nuevo mensaje
    if (data && data.length > 0) {
      this.notifySubscribers(data[0]);
    }

    return data;
  }

  // ✅ Método para suscribirse a nuevos mensajes
  subscribe(callback: (message: any) => void) {
    this.subscribers.push(callback);
  }

  private notifySubscribers(message: any) {
    this.subscribers.forEach((callback) => callback(message));
  }
}