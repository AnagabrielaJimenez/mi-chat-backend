import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsController } from './contacts.controller';
import { SupabaseModule } from '../supabase/supabase.module';
import { AuthGuard } from '../auth/auth.guard'; // ✅ Importamos el AuthGuard

@Module({
  imports: [SupabaseModule],
  controllers: [ContactsController],
  providers: [ContactsService, AuthGuard], // ✅ Agregamos el AuthGuard como provider
})
export class ContactsModule {}
