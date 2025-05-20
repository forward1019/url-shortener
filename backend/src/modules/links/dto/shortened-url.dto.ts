import { ApiProperty } from '@nestjs/swagger';
export class ShortenedUrlDto {
  @ApiProperty({
    description: 'The shortened URL id',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'The shortened URL that redirects to the original URL',
    example: 'https://short.ly/my-link',
  })
  shortUrl: string;

  @ApiProperty({
    description: 'The original URL that was shortened',
    example: 'https://example.com/very/long/url/that/needs/shortening',
  })
  originalUrl: string;

  @ApiProperty({
  description: 'The origin domain',
  example: 'example.com',
  required: false,
  })
  originDomain: string;

  @ApiProperty({
    description: 'The creation timestamp of the short link',
    example: '2024-05-16T08:52:29.123Z',
  })
  createdAt?: Date;

  @ApiProperty({
    description: 'The number of times this short link has been visited',
    example: 42,
  })
  visitCount?: number;
}
