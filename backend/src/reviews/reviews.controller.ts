import { Controller, Get, Param, Patch, Body, Post, Query, HttpException, HttpStatus } from '@nestjs/common';
import { NormalizedReviewsResponse } from './interfaces/review.interface';
import { ReviewsService } from './reviews.service';

@Controller('api/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  /**
   * Get normalized Hostaway reviews
   * @returns NormalizedReviewsResponse containing normalized Hostaway reviews
   */
  @Get('hostaway')
  async getHostawayReviews(): Promise<NormalizedReviewsResponse> {
    try {
      return await this.reviewsService.getHostawayReviews();
    } catch (error) {
      throw new HttpException(
        error || 'Failed to fetch Hostaway reviews',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get normalized Google reviews
   * @param placeId The Google Place ID to fetch reviews for
   * @returns NormalizedReviewsResponse containing normalized Google reviews
   */
  @Get('google')
  async getGoogleReviews(@Query('placeId') placeId: string): Promise<NormalizedReviewsResponse> {
    try {
      return await this.reviewsService.getGoogleReviews(placeId);
    } catch (error) {
      throw new HttpException(
        error || 'Failed to fetch Google reviews',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Get all reviews from all sources
   * @returns NormalizedReviewsResponse containing all normalized reviews
   */
  @Get()
  async getAllReviews(): Promise<NormalizedReviewsResponse> {
    try {
      return await this.reviewsService.getAllReviews();
    } catch (error) {
      throw new HttpException(
        error || 'Failed to fetch reviews',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Approve or unapprove a review
   * @param id The ID of the review to update
   * @param body The update data containing the approved status
   * @returns The updated review
   */
  @Patch(':id')
  async approveReview(
    @Param('id') id: string,
    @Body() body: { approved: boolean },
  ) {
    try {
      return await this.reviewsService.approveReview(id, body.approved);
    } catch (error) {
      throw new HttpException(
        error || 'Failed to update review',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Bulk update reviews
   * @param body The bulk update data containing review IDs and approved status
   * @returns Summary of the update operation
   */
  @Post('bulk')
  async bulkUpdateReviews(
    @Body() body: { ids: string[]; approved: boolean },
  ) {
    try {
      return await this.reviewsService.bulkUpdateReviews(body.ids, body.approved);
    } catch (error) {
      throw new HttpException(
        error || 'Failed to bulk update reviews',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
