'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { reviewsApi } from '@/lib/api';
import { Review } from '@/types/review';

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({
    search: '',
    rating: '',
    category: '',
    channel: '',
    dateRange: '',
    source: '',
  });

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
      // search
      if (
        filter.search &&
        !review.reviewer.toLowerCase().includes(filter.search.toLowerCase()) &&
        !review.listingName.toLowerCase().includes(filter.search.toLowerCase())
      ) {
        return false;
      }

      // rating
      if (filter.rating && review.rating) {
        const minRating = parseInt(filter.rating);
        if (review.rating < minRating) {
          return false;
        }
      }

      // category
      if (filter.category && review.categories) {
        const normalizedKey = filter.category.toLowerCase();
        const match = Object.keys(review.categories).some(
          (k) => k.toLowerCase() === normalizedKey
        );
        if (!match) return false;
      }

      // channel
      if (filter.channel && review.channel.toLowerCase() !== filter.channel.toLowerCase()) {
        return false;
      }

      // source
      if (filter.source && review.source.toLowerCase() !== filter.source.toLowerCase()) {
        return false;
      }

      // date range
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
    })
    .sort((a, b) => {
      return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
    });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary-800">
            All Reviews
          </h1>
          <p className="mt-2 text-sm text-secondary-600">
            Browse all guest reviews across all properties
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/dashboard"
            className="px-4 py-2 text-sm font-medium bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors shadow-sm"
          >
            Reviews Dashboard
          </Link>
        </div>
      </div>

      {/* Filters Card */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-secondary-100">
        <div className="p-4 sm:p-6 border-b border-secondary-200">
          <h2 className="text-lg font-medium text-primary-700 mb-4">
            Filter Reviews
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-secondary-700 mb-1"
              >
                Search
              </label>
              <input
                type="text"
                id="search"
                name="search"
                value={filter.search}
                onChange={handleFilterChange}
                className="input w-full"
                placeholder="Search by name or property..."
              />
            </div>

            {/* Rating */}
            <div>
              <label
                htmlFor="rating"
                className="block text-sm font-medium text-secondary-700 mb-1"
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
                {[9, 8, 7, 6, 5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {r}+
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-secondary-700 mb-1"
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
                {['Cleanliness','Communication','Check-in','Accuracy','Location','Value','House Rules'].map((c) => (
                  <option key={c} value={c.toLowerCase()}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Channel */}
            <div>
              <label
                htmlFor="channel"
                className="block text-sm font-medium text-secondary-700 mb-1"
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
                {['Airbnb','Booking.com','VRBO','Google'].map((ch) => (
                  <option key={ch} value={ch.toLowerCase()}>
                    {ch}
                  </option>
                ))}
              </select>
            </div>

            {/* Source */}
            <div>
              <label
                htmlFor="source"
                className="block text-sm font-medium text-secondary-700 mb-1"
              >
                Source
              </label>
              <select
                id="source"
                name="source"
                value={filter.source}
                onChange={handleFilterChange}
                className="input w-full"
              >
                <option value="">All Sources</option>
                {['Hostaway','Google'].map((src) => (
                  <option key={src} value={src.toLowerCase()}>
                    {src}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label
                htmlFor="dateRange"
                className="block text-sm font-medium text-secondary-700 mb-1"
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
                <option value="">All time</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="180">Last 6 months</option>
                <option value="365">Last year</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden border border-secondary-100">
        {loading ? (
          <div className="p-6 text-center text-secondary-600">Loading reviews...</div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">{error}</div>
        ) : filteredReviews.length === 0 ? (
          <div className="p-6 text-center text-secondary-500">
            No reviews match your filter criteria
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200">
              <thead className="bg-secondary-50">
                <tr>
                  {['Property','Reviewer','Rating','Channel','Date','Approved'].map((col) => (
                    <th
                      key={col}
                      className="px-6 py-3 text-left text-sm font-bold text-primary-700 uppercase tracking-wider"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-secondary-200">
                {filteredReviews.map((review) => (
                  <tr key={review.id} className="hover:bg-secondary-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link
                        href={`/properties/${review.listingId}`}
                        className="text-sm font-medium text-primary-600 hover:text-primary-800"
                      >
                        {review.listingName}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-secondary-900">
                        {review.reviewer}
                      </div>
                      <div className="text-xs text-secondary-500">{review.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap align-top">
                      <span className="flex items-center text-amber-500 font-medium">
                        ★ {review.rating || 'N/A'}
                      </span>
                      <div className="text-xs text-secondary-500 mt-1 space-y-1">
                        {Object.entries(review.categories || {})
                          .reduce((acc: [string, number][][], curr, idx) => {
                            const [key, rating] = curr;
                            if (rating !== undefined) {
                              if (idx % 2 === 0) acc.push([[key, rating]]);
                              else acc[acc.length - 1].push([key, rating]);
                            }
                            return acc;
                          }, [])
                          .map((pair, i) => (
                            <div key={i}>
                              {pair
                                .map(([k, v]) => `${k.replace('_', ' ')}: ${v}`)
                                .join(', ')}
                            </div>
                          ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                      {review.channel}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                      {new Date(review.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          review.approved
                            ? 'bg-green-50 text-green-700 border border-green-200'
                            : 'bg-red-50 text-red-700 border border-red-200'
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
        )}
      </div>
    </div>
  );
}
