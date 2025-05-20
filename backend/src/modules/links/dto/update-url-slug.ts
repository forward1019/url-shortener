import { IsOptional, IsString, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class UpdateShortSlugDto {
  @ApiPropertyOptional({
    description: 'New custom short slug (4-15 characters). If omitted, a new random slug will be generated.',
    example: 'my-new-slug',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @MinLength(4, { message: 'Short slug must be at least 4 characters long' })
  @MaxLength(15, { message: 'Short slug must be at most 15 characters long' })
  @Matches(/^[a-z0-9-]+$/, { message: 'Slug must be 4-15 chars: a-z, 0-9, -' })
  shortSlug?: string;
}
