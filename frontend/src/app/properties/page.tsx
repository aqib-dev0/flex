'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { propertiesApi } from '@/lib/api';
import { Property } from '@/types/review';

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState({
    search: '',
    city: '',
    sort: 'rating-desc',
  });

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const data = await propertiesApi.getProperties();

        if (!Array.isArray(data)) {
          throw new Error('Invalid properties data');
        }

        const normalizedProperties = data.map((prop) => ({
          id: prop.id || '',
          name: prop.name || 'Unnamed Property',
          thumbnail: prop.thumbnail || 'https://picsum.photos/seed/default/400/300',
          averageRating: prop.averageRating || 0,
          reviewCount: prop.reviewCount || 0,
          city: prop.city || 'Unknown',
          topCategory: prop.topCategory || 'N/A',
          trending: prop.trending || 'stable',
        }));

        setProperties(normalizedProperties);
      } catch (err) {
        setError(
          'Failed to load properties: ' +
            (err instanceof Error ? err.message : String(err))
        );
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
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

  // Extract unique cities for dropdown
  const cities = Array.from(
    new Set(properties.map((p) => p.city).filter((c) => c && c !== 'Unknown'))
  );

  // Apply filters and sorting
  const filteredProperties = properties
    .filter((property) => {
      // Search filter (case-insensitive + trimmed)
      if (
        filter.search &&
        !property.name.toLowerCase().includes(filter.search.trim().toLowerCase())
      ) {
        return false;
      }

      // City filter (case-insensitive)
      if (
        filter.city &&
        property.city?.toLowerCase() !== filter.city.toLowerCase()
      ) {
        return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (filter.sort) {
        case 'rating-desc':
          return (b.averageRating || 0) - (a.averageRating || 0);
        case 'rating-asc':
          return (a.averageRating || 0) - (b.averageRating || 0);
        case 'reviews-desc':
          return (b.reviewCount || 0) - (a.reviewCount || 0);
        case 'name-asc':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-primary-600">
            Property Portfolio
          </h2>
          <p className="mt-2 text-secondary-600">
            View and manage all properties in the Flex Living portfolio
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link href="/dashboard" className="btn btn-primary">
            Reviews Dashboard
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-4 mb-6">
        <div className="sm:flex sm:items-center gap-4">
          {/* Search */}
          <div className="relative mt-2 rounded-md shadow-sm w-full sm:max-w-xs">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="h-5 w-5 text-secondary-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              name="search"
              value={filter.search}
              onChange={handleFilterChange}
              className="input pl-10 w-full sm:w-64"
              placeholder="Search properties..."
            />
          </div>

          {/* City */}
          <div className="mt-4 sm:mt-0">
            <select
              name="city"
              value={filter.city}
              onChange={handleFilterChange}
              className="input sm:w-48"
            >
              <option value="">All Cities</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="mt-4 sm:mt-0">
            <select
              name="sort"
              value={filter.sort}
              onChange={handleFilterChange}
              className="input sm:w-48"
            >
              <option value="rating-desc">Highest Rated</option>
              <option value="rating-asc">Lowest Rated</option>
              <option value="reviews-desc">Most Reviews</option>
              <option value="name-asc">Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-12">
          <p>Loading properties...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProperties.map((property) => (
            <Link
              href={`/properties/${property.id}`}
              key={property.id}
              className="card hover:shadow-lg transition-shadow bg-white"
            >
              <div className="relative w-full h-48">
                <Image
                  src={property.thumbnail || '/placeholder-image.jpg'}
                  alt={property.name}
                  className="object-cover"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
                <div className="absolute top-2 right-2">
                  <span
                    className={`badge ${
                      property.trending === 'up'
                        ? 'badge-green'
                        : property.trending === 'down'
                        ? 'badge-red'
                        : 'badge-yellow'
                    }`}
                  >
                    {property.trending === 'up'
                      ? '↑ Trending up'
                      : property.trending === 'down'
                      ? '↓ Trending down'
                      : '→ Stable'}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-primary-700 truncate">
                    {property.name}
                  </h3>
                </div>
                <div className="mt-1 text-sm text-secondary-500">
                  {property.city}
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="flex items-center text-amber-500">
                      <svg
                        className="w-5 h-5 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-medium">
                        {property.averageRating?.toFixed(1) ?? 'N/A'}
                      </span>
                    </span>
                    <span className="ml-2 text-secondary-500 text-sm">
                      ({property.reviewCount ?? 0} reviews)
                    </span>
                  </div>
                  <div>
                    <span className="badge bg-primary-100 text-primary-700">
                      Top: {property.topCategory}
                    </span>
                  </div>
                </div>
                <div className="mt-4 h-2 bg-secondary-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-500"
                    style={{
                      width: `${((property.averageRating ?? 0) / 10) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {filteredProperties.length === 0 && !loading && !error && (
        <div className="text-center py-12 text-secondary-500 dark:text-secondary-400">
          No properties match your search criteria
        </div>
      )}
    </div>
  );
}
