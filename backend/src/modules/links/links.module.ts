import { Module } from '@nestjs/common';
import { LinkController } from './controllers/link.controller';
import { LinkService } from './services/link.service';
import { SlugGeneratorService } from '../../common/utils/slug-generator';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [LinkController],
  providers: [LinkService, SlugGeneratorService],
  exports: [LinkService],
})
export class LinksModule {}
