import { Controller, Post, Get, Put, Delete, Body, Param, Res, HttpStatus, HttpCode, UseGuards, Query } from '@nestjs/common';
import { Response } from 'express';
import { LinkService } from '../services/link.service';
import { ShortenUrlDto } from '../dto/shorten-url.dto';
import { ShortenedUrlDto } from '../dto/shortened-url.dto';
import { UpdateShortSlugDto } from '../dto/update-url-slug';
import { PaginationQueryDto } from '../dto/pagination-query.dto';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { ApiResponse } from '../../../common/interfaces/api-response.interface';


// User type definition - matching Prisma schema
interface User {
  id: string;
  email?: string;
  name?: string;
  avatarUrl?: string;
}

@Controller('api')
export class LinkController {
  constructor(private readonly linkService: LinkService) {}

@Get('urls')
async getAllUrls(
  @Query() query: PaginationQueryDto
): Promise<{ data: ShortenedUrlDto[]; meta: any }> {
  return this.linkService.getAllLinks(query);
}

@Get('my-urls')
@UseGuards(AuthGuard)
async getMyUrls(
  @CurrentUser() user: User,
  @Query() query: PaginationQueryDto,
): Promise<{ data: ShortenedUrlDto[]; meta: any }> {
  return this.linkService.getUserLinks(user.id, query);
}

  @Post('shorten')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async shortenUrlUser(
    @Body() shortenUrlDto: ShortenUrlDto,
    @CurrentUser() user?: User
  ): Promise<ApiResponse<ShortenedUrlDto>> {
    const data = await this.linkService.createUserShortUrl(shortenUrlDto, user.id);
    return { message: 'Short URL created successfully', data };
  }

  @Post('shorten/guest')
  @HttpCode(HttpStatus.CREATED)
  async shortenUrlGuest(
    @Body() shortenUrlDto: ShortenUrlDto
  ): Promise<ApiResponse<ShortenedUrlDto>> {
    const data = await this.linkService.createGuestShortUrl(shortenUrlDto);
    return { message: 'Short URL created successfully', data };
  }

  @Get('/:shortSlug')
  async redirectToOriginal(
    @Param('shortSlug') shortSlug: string,
    @Res() res: Response
  ): Promise<void> {
    const { originalUrl } = await this.linkService.getOriginalUrl(shortSlug);
    res.redirect(HttpStatus.FOUND, originalUrl);
  }

  @Put('shorten/:id/slug')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async updateShortSlug(
    @Param('id') id: number,
    @Body() updateShortSlugDto: UpdateShortSlugDto,
    @CurrentUser() user: User,
  ): Promise<ApiResponse<ShortenedUrlDto>> {
    const data = await this.linkService.updateShortSlug(id, updateShortSlugDto, user.id);
    return {
      message: 'Short url slug updated successfully',
      data,
    };
  }

  @Delete('shorten/:id/slug')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async DeleteShortUrl(
    @Param('id') id: number,
    @CurrentUser() user: User,
  ): Promise<{ message : string }> {
    await this.linkService.deleteShortUrl(id, user.id);
    return {
      message: 'Short url slug deleted successfully',
    };
  }
}
