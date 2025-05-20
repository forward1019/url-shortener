import { Injectable, Logger, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../common/database/prisma.service';
import { SlugGeneratorService } from '../../../common/utils/slug-generator';
import { ShortenUrlDto } from '../dto/shorten-url.dto';
import { ShortenedUrlDto } from '../dto/shortened-url.dto';
import { UpdateShortSlugDto } from '../dto/update-url-slug';
import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { Link } from '../entities/link.entity';
import { getAvaliableUniqueSlug } from 'src/common/utils/slug-helper';
import { paginate, SORT_FIELD_MAP } from 'src/common/pagination/paginate.helper';

@Injectable()
export class LinkService {
  private readonly logger = new Logger(LinkService.name);
  private readonly appDomain: string;
  private readonly apiPrefix: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly slugGenerator: SlugGeneratorService,
    private readonly configService: ConfigService,

  ) {
    this.appDomain = this.configService.get<string>('app.domain');
    this.apiPrefix = this.configService.get<string>('app.apiPrefix');
  }

  private async checkSlugForProfanity(slug: string) {
     const { Filter } = await import('bad-words');
     const badWordsFilter = new Filter();
     if (slug && badWordsFilter.isProfane(slug)) {
      throw new BadRequestException('Slug contains inappropriate words.');
    }
  }

  private async createShortUrl(shortenUrlDto: ShortenUrlDto, userId?: string | null): Promise<ShortenedUrlDto> {
    this.logger.log(`Creating short URL for: ${shortenUrlDto.originalUrl}`);

    const originDomain = this.extractDomain(shortenUrlDto.originalUrl);
    if(shortenUrlDto.shortSlug) {
      this.checkSlugForProfanity(shortenUrlDto.shortSlug)
    }
    const shortSlug = await getAvaliableUniqueSlug(
      this.prisma,
      shortenUrlDto.shortSlug,
      this.slugGenerator
    );

    const link = await this.prisma.link.create({
      data: {
        originalUrl: shortenUrlDto.originalUrl,
        originDomain,
        shortSlug,
        userId: userId || null,
      },
    });

    return this.mapLinkToShortenedUrlDto(link as Link);
  }

  private async findLinksWithPagination(
    query: PaginationQueryDto,
    userId?: string
  ): Promise<{ data: ShortenedUrlDto[]; meta: any }> {
    const baseParams = userId ? { userId } : {};
    const where = query.search
      ? {
          ...baseParams,
          OR: [
            { shortSlug: { contains: query.search, mode: 'insensitive' } },
            { originDomain: { contains: query.search, mode: 'insensitive' } },
          ],
        }
      : baseParams;

    const sortField = SORT_FIELD_MAP[query.sort_field] || 'createdAt';
    const sortOrder = query.sort_order === 'asc' ? 'asc' : 'desc';
    const orderBy = { [sortField]: sortOrder };

    const { data: links, meta } = await paginate(
      this.prisma.link,
      where,
      orderBy,
      query,
    );
    return {
      data: links.map(link => this.mapLinkToShortenedUrlDto(link)),
      meta,
    };
  }

  /**
   * Create a shortened URL from a long URL for auth user
   * @param shortenUrlDto The DTO containing the original URL and optional custom slug
   * @param userId The user ID to associate with the link
   * @returns The shortened URL information
   */
  async createUserShortUrl(shortenUrlDto: ShortenUrlDto, userId: string): Promise<ShortenedUrlDto> {
  return this.createShortUrl(shortenUrlDto, userId);
  }

  /**
   * Create a shortened URL from a long URL for guest
   * @param shortenUrlDto The DTO containing the original URL and optional custom slug
   * @returns The shortened URL information
   */
  async createGuestShortUrl(shortenUrlDto: ShortenUrlDto): Promise<ShortenedUrlDto> {
    if (shortenUrlDto.shortSlug) {
    throw new BadRequestException('Please sign in to set a custom short slug.');
    }
    return this.createShortUrl(shortenUrlDto, null);
  }

  /**
   * Update a shortened URL from a long URL for auth user
   * @param id The ID of the short link to update
   * @param shortenUrlDto The DTO containing the original URL and optional custom slug
   * @param userId The user ID associated with the link
   * @returns The shortened URL information
   */
  async updateShortSlug(id: number, updateShortSlugDto: UpdateShortSlugDto, userId: string): Promise<ShortenedUrlDto> {
    this.logger.log(`Updating short URL for: ${id}`);

    const link = await this.prisma.link.findUnique({ where: { id } });
    if (!link) {
    throw new NotFoundException('Short link not found.');
    }
    if (link.userId !== userId) {
      throw new ForbiddenException('No permission to update this short link.');
    }
    if (updateShortSlugDto.shortSlug && updateShortSlugDto.shortSlug === link.shortSlug) {
        throw new BadRequestException('No changes detected: the short link slug is the same as before.');
    }
    if (updateShortSlugDto.shortSlug) {
    this.checkSlugForProfanity(updateShortSlugDto.shortSlug);
    }

    const newSlug = await getAvaliableUniqueSlug(
      this.prisma,
      updateShortSlugDto.shortSlug,
      this.slugGenerator
    );

    const updated = await this.prisma.link.update({
    where: { id },
    data: { shortSlug: newSlug },
  });

  return this.mapLinkToShortenedUrlDto(updated as Link);

  }

    /**
   * Delete a shortened URL from a long URL for auth user
   * @param id The ID of the short link to delete
   * @param userId The user ID associated with the link
   * @returns The shortened URL information
   */
  async deleteShortUrl(id: number, userId: string): Promise<void> {
    this.logger.log(`Deleteing short URL for: ${id}`);

    const link = await this.prisma.link.findUnique({ where: { id } });
    if (!link) {
    throw new NotFoundException('Short link not found.');
    }
    if (link.userId !== userId) {
      throw new ForbiddenException('No permission to update this short link.');
    }

    await this.prisma.link.delete({ where: { id }});

  }

  /**
   * Get the original URL based on a short slug and increments the visit count
   * @param shortSlug The short slug to look up
   * @returns The original URL information
   */
  async getOriginalUrl(shortSlug: string): Promise<{ originalUrl: string }> {
    this.logger.log(`Getting original URL for slug: ${shortSlug}`);

    // Atomically increment the visit count and get the original URL
    const link = await this.prisma.link.update({
      where: { shortSlug },
      data: { visitCount: { increment: 1 } },
      select: { originalUrl: true },
    });

    if (!link) {
      this.logger.warn(`Slug not found: ${shortSlug}`);
      throw new NotFoundException(`Short URL with slug "${shortSlug}" not found`);
    }

    return { originalUrl: link.originalUrl };
  }

  /**
   * Get all links in the database
   * @returns An array of all links
   */
  async getAllLinks(query: PaginationQueryDto): Promise<{ data: ShortenedUrlDto[]; meta: any }> {
    this.logger.log('Getting all links');
    return this.findLinksWithPagination(query);
  }

  /**
   * Get links for a specific user
   * @param userId The user ID to filter by
   * @returns An array of links for the specified user
   */
  async getUserLinks(userId: string, query: PaginationQueryDto): Promise<{ data: ShortenedUrlDto[]; meta: any }> {
    this.logger.log(`Getting links for user: ${userId}`);
    return this.findLinksWithPagination(query, userId);
  }

  /**
   * Map a Link entity to a ShortenedUrlDto
   * @param link The link entity from the database
   * @returns A DTO with the formatted short URL
   */
  private mapLinkToShortenedUrlDto(link: Link): ShortenedUrlDto {
    const shortUrl = `${this.appDomain}/${link.shortSlug}`;

    return {
      id: link.id,
      shortUrl,
      originalUrl: link.originalUrl,
      originDomain: link.originDomain,
      visitCount: link.visitCount,
      createdAt:  link.createdAt,
    };
  }

  /**
   * Extract the domain from a URL
   * @param url The URL to extract the domain from original URl
   * @returns The domain
   */
  private extractDomain(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch (error) {
      // If URL parsing fails, return the original URL
      return url;
    }
  }
}
