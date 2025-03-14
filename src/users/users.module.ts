import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller'; // ✅ Importamos UsersController
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [UsersController], // ✅ Se agrega UsersController
  providers: [UsersService],
  exports: [UsersService], // ✅ Exportamos para que AuthModule pueda usarlo
})
export class UsersModule {}
