import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../common/database/database.module';
import { AuthService } from './services/auth.service';
import { SupabaseService } from './services/supabase.service';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [
    DatabaseModule,
  ],
  providers: [
    AuthService,
    SupabaseService,
    AuthGuard,
  ],
  exports: [
    AuthService,
    SupabaseService,
    AuthGuard,
  ],
})
export class AuthModule {}
