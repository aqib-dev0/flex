'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { reviewsApi } from '@/lib/api';
import { Review } from '@/types/review';

export default function Dashboard() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [selectedReviews, setSelectedReviews] = useState<string[]>([]);
  const [filter, setFilter] = useState({
    rating: '',
    category: '',
    channel: '',
    dateRange: '',
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
        if (!data || !data.reviews) {
          setError('No reviews found');
          return;
        }
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

  const handleBulkAction = async (approve: boolean) => {
    if (selectedReviews.length === 0) return;

    try {
      setLoading(true);
      const updatePromises = selectedReviews.map((id) =>
        reviewsApi.approveReview(id, approve)
      );
      await Promise.all(updatePromises);

      const data = await reviewsApi.getAllReviews();
      setReviews(data.reviews);
      setSelectedReviews([]);
      setMessage(
        `Successfully ${approve ? 'approved' : 'unapproved'} ${
          updatePromises.length
        } reviews`
      );
    } catch (err) {
      console.error('Failed to update reviews:', err);
      setError(`Failed to ${approve ? 'approve' : 'unapprove'} reviews`);
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 3000); // clear success message after 3s
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

  const filteredReviews = reviews.filter((review) => {
    if (filter.rating && review.rating) {
      if (review.rating < parseInt(filter.rating)) return false;
    }
    if (filter.category && review.categories) {
      if (!review.categories[filter.category]) return false;
    }
    if (filter.channel && review.channel !== filter.channel) return false;
    if (filter.dateRange) {
      const daysAgo = parseInt(filter.dateRange);
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - daysAgo);
      if (new Date(review.submittedAt) < cutoff) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900">Reviews Dashboard</h1>
          <p className="mt-2 text-sm text-secondary-600">
            Manage and monitor all property reviews in one place
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-3">
          <button
            onClick={() => handleBulkAction(true)}
            disabled={selectedReviews.length === 0 || loading}
            className="btn"
          >
            Approve Selected ({selectedReviews.length})
          </button>
          <button
            onClick={() => handleBulkAction(false)}
            disabled={selectedReviews.length === 0 || loading}
            className="btn-secondary"
          >
            Unapprove Selected
          </button>
        </div>
      </div>

      {/* Success/Error message */}
      {message && (
        <div className="p-3 rounded-md bg-green-50 text-green-800 text-sm">
          {message}
        </div>
      )}
      {error && (
        <div className="p-3 rounded-md bg-red-50 text-red-800 text-sm">{error}</div>
      )}

      {/* Filters */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-secondary-900">Filter Reviews</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium mb-1">Minimum Rating</label>
            <select
              name="rating"
              value={filter.rating}
              onChange={handleFilterChange}
              className="input"
            >
              <option value="">Any</option>
              {[9, 8, 7, 6, 5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n}+
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              name="category"
              value={filter.category}
              onChange={handleFilterChange}
              className="input"
            >
              <option value="">All</option>
              <option value="cleanliness">Cleanliness</option>
              <option value="communication">Communication</option>
              <option value="check_in">Check-in</option>
              <option value="accuracy">Accuracy</option>
              <option value="location">Location</option>
              <option value="value">Value</option>
              <option value="respect_house_rules">House Rules</option>
            </select>
          </div>

          {/* Channel */}
          <div>
            <label className="block text-sm font-medium mb-1">Channel</label>
            <select
              name="channel"
              value={filter.channel}
              onChange={handleFilterChange}
              className="input"
            >
              <option value="">All</option>
              <option value="airbnb">Airbnb</option>
              <option value="booking.com">Booking.com</option>
              <option value="vrbo">VRBO</option>
              <option value="google">Google</option>
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium mb-1">Time Period</label>
            <select
              name="dateRange"
              value={filter.dateRange}
              onChange={handleFilterChange}
              className="input"
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

      {/* Reviews */}
      {loading ? (
        <div className="p-6 text-center text-secondary-600">Loading reviews...</div>
      ) : filteredReviews.length === 0 ? (
        <div className="p-6 text-center text-secondary-600">No reviews found</div>
      ) : (
        <div className="card overflow-hidden">
          {Object.values(reviewsByProperty).map((property) => (
            <div key={property.id}>
              <div className="bg-secondary-50 px-4 py-3 flex justify-between items-center">
                <h3 className="text-md font-semibold">{property.name}</h3>
                <Link
                  href={`/properties/${property.id}`}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  View Property
                </Link>
              </div>

              <table className="min-w-full border-collapse">
                <thead className="bg-primary-50 sticky top-0 z-10">
                  <tr>
                    {['', 'Reviewer', 'Rating', 'Channel', 'Date', 'Approved'].map(
                      (header, i) => (
                        <th
                          key={i}
                          className="px-6 py-3 text-left text-xs font-semibold text-primary-700 uppercase tracking-wide border-b border-secondary-200"
                        >
                          {header}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-secondary-100">
                  {property.reviews
                    .filter((r) => filteredReviews.includes(r))
                    .map((review, idx) => (
                      <tr
                        key={review.id}
                        className={idx % 2 === 0 ? 'bg-white' : 'bg-secondary-50'}
                      >
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedReviews.includes(review.id)}
                            onChange={() => handleToggleReview(review.id)}
                            className="rounded text-primary-600 focus:ring-primary-500"
                          />
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="font-medium">{review.reviewer}</div>
                          <div className="text-secondary-500">{review.type}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`badge ${
                              review.rating >= 8
                                ? 'badge-green'
                                : review.rating >= 5
                                ? 'badge-yellow'
                                : 'badge-red'
                            }`}
                          >
                            ⭐ {review.rating || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-secondary-500">
                          {review.channel}
                        </td>
                        <td className="px-6 py-4 text-sm text-secondary-500">
                          {new Date(review.submittedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`badge ${
                              review.approved ? 'badge-green' : 'badge-red'
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
  );
}
