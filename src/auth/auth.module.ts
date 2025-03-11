import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SupabaseModule } from '../supabase/supabase.module';
import { UsersModule } from '../users/users.module'; // ✅ Importar UsersModule

@Module({
  imports: [SupabaseModule, UsersModule], // ✅ Agregar UsersModule
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}