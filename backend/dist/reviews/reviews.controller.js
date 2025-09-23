"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsController = void 0;
const common_1 = require("@nestjs/common");
const reviews_service_1 = require("./reviews.service");
let ReviewsController = class ReviewsController {
    constructor(reviewsService) {
        this.reviewsService = reviewsService;
    }
    async getHostawayReviews() {
        try {
            return await this.reviewsService.getHostawayReviews();
        }
        catch (error) {
            throw new common_1.HttpException(error || 'Failed to fetch Hostaway reviews', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getGoogleReviews(placeId) {
        try {
            return await this.reviewsService.getGoogleReviews(placeId);
        }
        catch (error) {
            throw new common_1.HttpException(error || 'Failed to fetch Google reviews', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getAllReviews() {
        try {
            return await this.reviewsService.getAllReviews();
        }
        catch (error) {
            throw new common_1.HttpException(error || 'Failed to fetch reviews', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async approveReview(id, body) {
        try {
            return await this.reviewsService.approveReview(id, body.approved);
        }
        catch (error) {
            throw new common_1.HttpException(error || 'Failed to update review', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async bulkUpdateReviews(body) {
        try {
            return await this.reviewsService.bulkUpdateReviews(body.ids, body.approved);
        }
        catch (error) {
            throw new common_1.HttpException(error || 'Failed to bulk update reviews', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.ReviewsController = ReviewsController;
__decorate([
    (0, common_1.Get)('hostaway'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "getHostawayReviews", null);
__decorate([
    (0, common_1.Get)('google'),
    __param(0, (0, common_1.Query)('placeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "getGoogleReviews", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "getAllReviews", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "approveReview", null);
__decorate([
    (0, common_1.Post)('bulk'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "bulkUpdateReviews", null);
exports.ReviewsController = ReviewsController = __decorate([
    (0, common_1.Controller)('api/reviews'),
    __metadata("design:paramtypes", [reviews_service_1.ReviewsService])
], ReviewsController);
//# sourceMappingURL=reviews.controller.js.map