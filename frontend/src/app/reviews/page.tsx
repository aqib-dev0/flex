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
    dateRange: '30',
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
      // Filter by search term (reviewer name or property name)
      if (
        filter.search &&
        !review.reviewer.toLowerCase().includes(filter.search.toLowerCase()) &&
        !review.listingName.toLowerCase().includes(filter.search.toLowerCase())
      ) {
        return false;
      }

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

      // Filter by source
      if (filter.source && review.source !== filter.source) {
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

      // By default, show all reviews
      return true;
    })
    .sort((a, b) => {
      // Sort by date, newest first
      return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
    });

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-secondary-900 dark:text-secondary-100">
            All Reviews
          </h1>
          <p className="mt-2 text-sm text-secondary-600 dark:text-secondary-400">
            Browse all guest reviews across all properties
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link href="/dashboard" className="btn btn-primary">
            Reviews Dashboard
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-secondary-800 shadow rounded-lg overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-secondary-200 dark:border-secondary-700">
          <h2 className="text-lg font-medium text-secondary-900 dark:text-secondary-100 mb-4">
            Filter Reviews
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1"
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
                htmlFor="source"
                className="block text-sm font-medium text-secondary-700 dark:text-secondary-300 mb-1"
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
                <option value="hostaway">Hostaway</option>
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
        ) : filteredReviews.length === 0 ? (
          <div className="p-6 text-center text-secondary-500 dark:text-secondary-400">
            No reviews match your filter criteria
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200 dark:divide-secondary-700">
              <thead className="bg-secondary-50 dark:bg-secondary-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-secondary-500 dark:text-secondary-400 uppercase tracking-wider">
                    Property
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
                {filteredReviews.map((review) => (
                  <tr key={review.id} className="hover:bg-secondary-50 dark:hover:bg-secondary-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link 
                        href={`/properties/${review.listingId}`}
                        className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        {review.listingName}
                      </Link>
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
                      <div className="flex items-center">
                        <span className="flex items-center text-amber-500">
                          <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="font-medium">{review.rating || 'N/A'}</span>
                        </span>
                      </div>
                      <div className="text-xs mt-1">
                        {Object.entries(review.categories || {}).map(
                          ([key, value]) => (
                            <span 
                              key={key}
                              className="inline-block mr-1 text-secondary-500 dark:text-secondary-400"
                            >
                              {key.replace('_', ' ')}: {value}
                            </span>
                          )
                        )}
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
        )}
      </div>
    </div>
  );
}
