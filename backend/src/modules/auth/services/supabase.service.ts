import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
  private supabase: SupabaseClient;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.supabase = createClient(
      this.configService.get<string>('supabase.url'),
      this.configService.get<string>('supabase.anonKey'),
    );
  }

  getClient(): SupabaseClient {
    return this.supabase;
  }

  /**
   * Verify a JWT token from Supabase
   * @param token JWT token from Supabase auth
   */
  async verifyToken(token: string): Promise<boolean> {
    try {
      const { data, error } = await this.supabase.auth.getUser(token);

      if (error || !data.user) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get user data from a JWT token
   * @param token JWT token from Supabase auth
   */
  async getUserFromToken(token: string) {
    try {
      const { data, error } = await this.supabase.auth.getUser(token);

      if (error || !data.user) {
        return null;
      }

      return {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || data.user.email?.split('@')[0],
        avatarUrl: data.user.user_metadata?.avatar_url,
      };
    } catch (error) {
      return null;
    }
  }
}
