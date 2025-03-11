import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly supabaseService: SupabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      console.log('❌ No se proporcionó token');
      throw new ForbiddenException('Token no proporcionado');
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('🔹 Token recibido:', token);

    const supabase = this.supabaseService.getClient();
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data?.user) {
      console.log('❌ Token inválido o usuario no encontrado:', error);
      throw new ForbiddenException('Token inválido o usuario no autorizado');
    }

    console.log('✅ Usuario autenticado correctamente:', data.user);
    (request as any).user = data.user;
    return true;
  }
}