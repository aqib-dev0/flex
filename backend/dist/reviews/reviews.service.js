"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ReviewsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const hostaway_normalizer_1 = require("./normalizers/hostaway.normalizer");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let ReviewsService = ReviewsService_1 = class ReviewsService {
    constructor(hostawayNormalizer) {
        this.hostawayNormalizer = hostawayNormalizer;
        this.logger = new common_1.Logger(ReviewsService_1.name);
        this.reviewsStore = new Map();
    }
    async getHostawayReviews() {
        try {
            const filePath = path.resolve(process.cwd(), 'src/data/hostaway/reviews.json');
            const rawData = fs.readFileSync(filePath, 'utf8');
            const rawReviews = JSON.parse(rawData);
            const normalizedReviews = this.hostawayNormalizer.normalizeMany(rawReviews);
            normalizedReviews.forEach(review => {
                this.reviewsStore.set(review.id, review);
            });
            return {
                reviews: normalizedReviews,
                meta: {
                    total: normalizedReviews.length,
                    source: 'hostaway',
                },
            };
        }
        catch (error) {
            this.logger.error(`Failed to get Hostaway reviews: ${error}`);
            throw new Error(`Failed to get Hostaway reviews: ${error}`);
        }
    }
    async getGoogleReviews(placeId) {
        try {
            if (!placeId) {
                throw new Error('Place ID is required');
            }
            this.logger.log(`Fetching Google reviews for place ID: ${placeId}`);
            return {
                reviews: [],
                meta: {
                    total: 0,
                    source: 'google',
                },
            };
        }
        catch (error) {
            this.logger.error(`Failed to get Google reviews: ${error}`);
            throw new Error(`Failed to get Google reviews: ${error}`);
        }
    }
    async getAllReviews() {
        try {
            const hostawayResponse = await this.getHostawayReviews();
            const allReviews = [...hostawayResponse.reviews];
            return {
                reviews: allReviews,
                meta: {
                    total: allReviews.length,
                    source: 'all',
                },
            };
        }
        catch (error) {
            this.logger.error(`Failed to get all reviews: ${error}`);
            throw new Error(`Failed to get all reviews: ${error}`);
        }
    }
    async approveReview(id, approved) {
        try {
            const review = this.reviewsStore.get(id);
            if (!review) {
                throw new common_1.NotFoundException(`Review with ID ${id} not found`);
            }
            const updatedReview = Object.assign(Object.assign({}, review), { approved });
            this.reviewsStore.set(id, updatedReview);
            const filePath = path.resolve(process.cwd(), 'src/data/hostaway/reviews.json');
            const rawData = fs.readFileSync(filePath, 'utf8');
            const reviews = JSON.parse(rawData);
            const reviewIndex = reviews.findIndex((r) => r.id === id);
            if (reviewIndex !== -1) {
                reviews[reviewIndex] = Object.assign(Object.assign({}, reviews[reviewIndex]), { approved: approved });
                fs.writeFileSync(filePath, JSON.stringify(reviews, null, 2));
            }
            return updatedReview;
        }
        catch (error) {
            this.logger.error(`Failed to approve review: ${error}`);
            throw error;
        }
    }
    async bulkUpdateReviews(ids, approved) {
        try {
            let updated = 0;
            let failed = 0;
            for (const id of ids) {
                try {
                    await this.approveReview(id, approved);
                    updated++;
                }
                catch (error) {
                    failed++;
                    this.logger.warn(`Failed to update review ${id}: ${error}`);
                }
            }
            return {
                updated,
                failed,
                totalProcessed: ids.length,
            };
        }
        catch (error) {
            this.logger.error(`Failed bulk update: ${error}`);
            throw new Error(`Failed bulk update: ${error}`);
        }
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = ReviewsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [hostaway_normalizer_1.HostawayNormalizer])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map