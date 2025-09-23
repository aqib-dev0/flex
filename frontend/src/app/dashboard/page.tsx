'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { reviewsApi } from '@/lib/api';
import { Review, NormalizedReviewsResponse } from '@/types/review';

export default function Dashboard() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);
  const [filter, setFilter] = useState({
    rating: '',
    category: '',
    channel: '',
    dateRange: '30',
  });

  // Group reviews by property
  const reviewsByProperty = reviews.reduce((acc, review) => {
    if (!acc[review.listingId]) {
      acc[review.listingId] = {
        id: review.listingId,
        name: review.listingName,
        reviews: [],
      };
    }
    acc[review.listingId].reviews.push(review);
    return acc;
  }, {} as Record<string, { id: string; name: string; reviews: Review[] }>);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const data = await reviewsApi.getAllReviews();
        setReviews(data.reviews);
      } catch (err) {
        setError('Failed to load reviews');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleToggleReview = (reviewId: string) => {
    setSelectedReviews((prev) =>
      prev.includes(reviewId)
        ? prev.filter((id) => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  const handleApproveSelected = async () => {
    if (selectedReviews.length === 0) return;

    try {
      setLoading(true);
      await reviewsApi.bulkUpdateReviews(selectedReviews, true);
      // Refresh the reviews
      const data = await reviewsApi.getAllReviews();
      setReviews(data.reviews);
      setSelectedReviews([]);
    } catch (err) {
      console.error('Failed to update reviews:', err);
      setError('Failed to approve reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleUnapproveSelected = async () => {
    if (selectedReviews.length === 0) return;

    try {
      setLoading(true);
      await reviewsApi.bulkUpdateReviews(selectedReviews, false);
      // Refresh the reviews
      const data = await reviewsApi.getAllReviews();
      setReviews(data.reviews);
      setSelectedReviews([]);
    } catch (err) {
      console.error('Failed to update reviews:', err);
      setError('Failed to unapprove reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFilter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filteredReviews = reviews
    .filter((review) => {
      // Filter by rating
      if (filter.rating && review.rating) {
        const minRating = parseInt(filter.rating);
        if (review.rating < minRating) {
          return false;
        }
      }

      // Filter by category
      if (filter.category && review.categories) {
        const categoryRating = review.categories[filter.category];
        if (!categoryRating) {
          return false;
        }
      }

      // Filter by channel
      if (filter.channel && review.channel !== filter.channel) {
        return false;
      }

      // Filter by date range
      if (filter.dateRange) {
        const daysAgo = parseInt(filter.dateRange);
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
        const reviewDate = new Date(review.submittedAt);
        if (reviewDate < cutoffDate) {
          return false;
        }
      }

      return true;
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-secondary-900 dark:text-secondary-100">
            Reviews Dashboard
          </h1>
          <p className="mt-2 text-sm text-secondary-600 dark:text-secondary-400">
            Manage and monitor all property reviews in one place
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-3">
          <button
            onClick={handleApproveSelected}
            disabled={selectedReviews.length === 0 || loading}
            className="btn btn-primary"
          >
            Approve Selected ({selectedReviews.length})
          </button>
          <button
            onClick={handleUnapproveSelected}
            disabled={selectedReviews.length === 0 || loading}
            className="btn btn-secondary"
          >
            Unapprove Selected
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-secondary-800 shadow rounded-lg overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-secondary-200 dark:border-secondary-700">
          <h2 className="text-lg font-medium text-secondary-900 dark:text-secondary-100">
            Filter Reviews
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <div>
              <label
                htmlFor="rating"
                className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1"
              >
                Minimum Rating
              </label>
              <select
                id="rating"
                name="rating"
                value={filter.rating}
                onChange={handleFilterChange}
                className="input w-full"
              >
                <option value="">Any Rating</option>
                <option value="9">9+</option>
                <option value="8">8+</option>
                <option value="7">7+</option>
                <option value="6">6+</option>
                <option value="5">5+</option>
                <option value="4">4+</option>
                <option value="3">3+</option>
                <option value="2">2+</option>
                <option value="1">1+</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1"
              >
                Category
              </label>
              <select
                id="category"
                name="category"
                value={filter.category}
                onChange={handleFilterChange}
                className="input w-full"
              >
                <option value="">All Categories</option>
                <option value="cleanliness">Cleanliness</option>
                <option value="communication">Communication</option>
                <option value="check_in">Check-in</option>
                <option value="accuracy">Accuracy</option>
                <option value="location">Location</option>
                <option value="value">Value</option>
                <option value="respect_house_rules">House Rules</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="channel"
                className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1"
              >
                Channel
              </label>
              <select
                id="channel"
                name="channel"
                value={filter.channel}
                onChange={handleFilterChange}
                className="input w-full"
              >
                <option value="">All Channels</option>
                <option value="airbnb">Airbnb</option>
                <option value="booking.com">Booking.com</option>
                <option value="vrbo">VRBO</option>
                <option value="google">Google</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="dateRange"
                className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1"
              >
                Time Period
              </label>
              <select
                id="dateRange"
                name="dateRange"
                value={filter.dateRange}
                onChange={handleFilterChange}
                className="input w-full"
              >
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="180">Last 6 months</option>
                <option value="365">Last year</option>
                <option value="">All time</option>
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-6 text-center">
            <p>Loading reviews...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            {Object.values(reviewsByProperty).map((property) => (
              <div
                key={property.id}
                className="border-b border-secondary-200 dark:border-secondary-700"
              >
                <div className="bg-secondary-50 dark:bg-secondary-700 px-4 py-3 flex justify-between items-center">
                  <h3 className="text-md font-medium text-secondary-900 dark:text-secondary-100">
                    {property.name}
                  </h3>
                  <Link
                    href={`/properties/${property.id}`}
                    className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    View Property
                  </Link>
                </div>

                <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-700">
                  <thead className="bg-secondary-50 dark:bg-secondary-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider w-10">
                        <input
                          type="checkbox"
                          className="rounded text-primary-600 focus:ring-primary-500"
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            const propertyReviewIds = property.reviews.map(
                              (r) => r.id
                            );
                            if (isChecked) {
                              setSelectedReviews((prev) => {
                                // Add all property review IDs that aren't already selected
                                const newSelected = [...prev];
                                propertyReviewIds.forEach(id => {
                                  if (!newSelected.includes(id)) {
                                    newSelected.push(id);
                                  }
                                });
                                return newSelected;
                              });
                            } else {
                              setSelectedReviews((prev) =>
                                prev.filter(
                                  (id) => !propertyReviewIds.includes(id)
                                )
                              );
                            }
                          }}
                          checked={property.reviews.every((review) =>
                            selectedReviews.includes(review.id)
                          )}
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                        Reviewer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                        Channel
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                        Approved
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-secondary-800 divide-y divide-secondary-200 dark:divide-secondary-700">
                    {property.reviews
                      .filter((review) => filteredReviews.includes(review))
                      .map((review) => (
                        <tr key={review.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              className="rounded text-primary-600 focus:ring-primary-500"
                              checked={selectedReviews.includes(review.id)}
                              onChange={() => handleToggleReview(review.id)}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-secondary-900 dark:text-secondary-100">
                              {review.reviewer}
                            </div>
                            <div className="text-sm text-secondary-500 dark:text-secondary-400">
                              {review.type}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-secondary-900 dark:text-secondary-100">
                              {review.rating || 'N/A'}/10
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500 dark:text-secondary-400">
                            {review.channel}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500 dark:text-secondary-400">
                            {new Date(review.submittedAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                review.approved
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {review.approved ? 'Yes' : 'No'}
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
