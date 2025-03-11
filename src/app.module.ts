import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SupabaseService } from './supabase/supabase.service';
import { AuthModule } from './auth/auth.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, MessagesModule],
  providers: [SupabaseService],
  exports: [SupabaseService],
})
export class AppModule {}