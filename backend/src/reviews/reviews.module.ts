import { Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { HostawayNormalizer } from './normalizers/hostaway.normalizer';

@Module({
  controllers: [ReviewsController],
  providers: [ReviewsService, HostawayNormalizer],
  exports: [ReviewsService],
})
export class ReviewsModule {}
