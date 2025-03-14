import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { UsersService } from '../users/users.service'; // ✅ Importar UsersService

@Injectable()
export class AuthService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly usersService: UsersService, // ✅ Inyectar UsersService
  ) {}

  async register(email: string, password: string, fullName: string = '') {
    const supabase = this.supabaseService.getClient();
  
    // 🔹 Crear usuario en auth.users
    const { data, error } = await supabase.auth.signUp({ email, password });
  
    if (error) throw new Error(error.message);
    const user = data.user;
  
    if (user) {
      console.log('🛠️ Intentando crear usuario en users:', user.id, email, fullName);
      try {
        // 🔹 Registrar en la tabla users después del registro en auth.users
        await this.usersService.createUser(user.id, email, fullName || '', '');
        console.log('✅ Usuario registrado en users');
      } catch (userError) {
        console.error('❌ Error al registrar en users:', userError);
      }
    }
  
    return user;
  }

  async login(email: string, password: string) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) throw new Error(error.message);
    return data;
  }

  async updateUser(id: string, fullName: string, avatarUrl: string) {
    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase
      .from('users')
      .update({ full_name: fullName, avatar_url: avatarUrl })
      .eq('id', id)
      .select('*');
  
    if (error) throw new Error(error.message);
    return data[0];
  }
  
}
