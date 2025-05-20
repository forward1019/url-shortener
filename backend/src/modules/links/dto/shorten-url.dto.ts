import { IsNotEmpty, IsUrl, IsString, IsOptional, IsInt, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class ShortenUrlDto {
  @ApiProperty({
    description: 'The original URL to be shortened',
    example: 'https://example.com/very/long/url/that/needs/shortening',
  })
  @IsNotEmpty({ message: 'Original URL is required' })
  @IsUrl({}, { message: 'Please provide a valid URL (e.g., https://example.com)' })
  @IsString()
  originalUrl: string;

  @ApiPropertyOptional({
    description: 'Custom short slug (4-15 characters)',
    example: 'my-link',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MinLength(4, { message: 'Short slug must be at least 4 characters long' })
  @MaxLength(15, { message: 'Short slug must be at most 15 characters long' })
  @Matches(/^[a-z0-9-]+$/, { message: 'Slug must be 4-15 chars: a-z, 0-9, -' })
  shortSlug?: string;
}
