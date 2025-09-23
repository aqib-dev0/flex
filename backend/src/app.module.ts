import { Module } from '@nestjs/common';
import { ReviewsModule } from './reviews/reviews.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ReviewsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
