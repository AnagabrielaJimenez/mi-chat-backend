import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';

@Injectable()
export class UsersService {
  constructor(private readonly supabaseService: SupabaseService) {}

  // ✅ Crear un nuevo usuario en la tabla "users"
  async createUser(id: string, email: string, fullName: string = '', avatarUrl: string = '') {
    const supabase = this.supabaseService.getClient();

    // 🔹 Verificar si el usuario ya existe
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', id)
      .single();

    if (existingUser) {
      console.log('⚠️ Usuario ya existe en users, no se insertará de nuevo.');
      return existingUser;
    }

    // 🔹 Insertar nuevo usuario
    const { data, error } = await supabase
      .from('users')
      .insert([{ id, email, full_name: fullName || '', avatar_url: avatarUrl || '' }])
      .select('*');

    if (error) throw new Error(error.message);
    return data[0];
  }

  // ✅ Obtener un usuario por su ID
  async getUserById(userId: string) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  // ✅ Buscar usuarios por nombre o correo
  async searchUsers(query: string) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('users')
      .select('id, full_name, email, avatar_url')
      .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
      .limit(10);

    if (error) throw new Error(error.message);
    return data;
  }

  async updateUser(id: string, fullName: string, avatarUrl: string) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('users')
      .update({ full_name: fullName || '', avatar_url: avatarUrl || '' })
      .eq('id', id)
      .select('*');
  
    if (error) throw new Error(error.message);
    return data[0];
  }
}
