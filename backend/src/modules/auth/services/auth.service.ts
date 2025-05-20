import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../common/database/prisma.service';
import { SupabaseService } from './supabase.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly supabaseService: SupabaseService,
  ) {}

  /**
   * Get or create a user in the database
   */
  async getUserFromToken(token: string) {
    // Get user data from Supabase
    const userData = await this.supabaseService.getUserFromToken(token);

    if (!userData) {
      return null;
    }

    // Check if user exists in our database
    let user = await this.prisma.user.findUnique({
      where: { id: userData.id },
    });

    // If not, create the user
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          avatarUrl: userData.avatarUrl,
        },
      });
    } else {
      // Update user data if it has changed
      if (
        user.email !== userData.email ||
        user.name !== userData.name ||
        user.avatarUrl !== userData.avatarUrl
      ) {
        user = await this.prisma.user.update({
          where: { id: userData.id },
          data: {
            email: userData.email,
            name: userData.name,
            avatarUrl: userData.avatarUrl,
          },
        });
      }
    }

    return user;
  }

  /**
   * Verify a JWT token
   */
  async verifyToken(token: string): Promise<boolean> {
    return this.supabaseService.verifyToken(token);
  }
}
