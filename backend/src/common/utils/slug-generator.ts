import { nanoid } from 'nanoid';
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { isSlugTaken } from './slug-helper';
import { customAlphabet } from 'nanoid';

@Injectable()
export class SlugGeneratorService {
  private readonly logger = new Logger(SlugGeneratorService.name);
  private readonly DEFAULT_SLUG_LENGTH = 6;
  private readonly MAX_RETRIES = 5;
  private readonly alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Generates a unique slug for URL shortening
   * @param length Optional length of the slug (default: 6)
   * @returns A unique slug string
   */
  async generateUniqueSlug(length: number = this.DEFAULT_SLUG_LENGTH): Promise<string> {
    let attempts = 0;
    let slug: string;
    let isUnique = false;

    while (!isUnique && attempts < this.MAX_RETRIES) {
      attempts++;
      slug = customAlphabet(this.alphabet, length)();

      // Use isSlugTaken helper check if the slug already exists in the database
      const isTaken = await isSlugTaken(this.prisma, slug);

      if (!isTaken) {
        this.logger.debug(`Generated unique slug: ${slug} (attempt ${attempts})`);
        return slug;
      }

      this.logger.debug(`Slug collision detected: ${slug}, retrying... (attempt ${attempts})`);
    }

    if (attempts >= this.MAX_RETRIES) {
      this.logger.warn(`Failed to generate unique slug after ${attempts} attempts`);
      // If reached maximum retries,  will try with a longer slug length
      return this.generateUniqueSlug(length + 1);
    }
   throw new Error('Failed to generate a unique slug');
  }
}
