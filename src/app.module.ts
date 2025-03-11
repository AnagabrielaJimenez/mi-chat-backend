import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseModule } from './supabase/supabase.module';
import { AuthModule } from './auth/auth.module';
import { MessagesModule } from './messages/messages.module';
import { ContactsModule } from './contacts/contacts.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, MessagesModule, ContactsModule, SupabaseModule],
})
export class AppModule {}
