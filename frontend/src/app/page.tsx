import { Property } from '@/types/review';
import Image from 'next/image';
import Link from 'next/link';

// This would normally come from an API call, but we'll mock it for now
const mockProperties: Property[] = [
  {
    id: '123456',
    name: '2B N1 A - 29 Shoreditch Heights',
    thumbnail: 'https://picsum.photos/seed/prop1/400/300',
    averageRating: 9.5,
    reviewCount: 22,
    city: 'London',
    topCategory: 'cleanliness',
    trending: 'up'
  },
  {
    id: '987421',
    name: 'Luxury Apartment in Central London',
    thumbnail: 'https://picsum.photos/seed/prop2/400/300',
    averageRating: 8.5,
    reviewCount: 14,
    city: 'London',
    topCategory: 'location',
    trending: 'stable'
  },
  {
    id: '394872',
    name: 'Cozy Studio in Camden Town',
    thumbnail: 'https://picsum.photos/seed/prop3/400/300',
    averageRating: 7.0,
    reviewCount: 9,
    city: 'London',
    topCategory: 'value',
    trending: 'down'
  }
];

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-secondary-900 dark:text-secondary-100">
            Property Portfolio
          </h1>
          <p className="mt-2 text-sm text-secondary-600 dark:text-secondary-400">
            Manage and monitor all properties in the Flex Living portfolio
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link href="/reviews" className="btn">
            View All Reviews
          </Link>
        </div>
      </div>

      <div className="mt-4 mb-6">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <div className="relative mt-2 rounded-md shadow-sm w-full sm:max-w-xs">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-secondary-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                className="input pl-10 w-full sm:w-64"
                placeholder="Search properties..."
              />
            </div>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-4">
            <select
              className="input sm:w-48"
              defaultValue="all"
            >
              <option value="all">All Cities</option>
              <option value="london">London</option>
              <option value="manchester">Manchester</option>
              <option value="edinburgh">Edinburgh</option>
            </select>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-4">
            <select
              className="input sm:w-48"
              defaultValue="rating-desc"
            >
              <option value="rating-desc">Highest Rated</option>
              <option value="rating-asc">Lowest Rated</option>
              <option value="reviews-desc">Most Reviews</option>
              <option value="name-asc">Name (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mockProperties.map((property) => (
          <Link href={`/properties/${property.id}`} key={property.id} className="card hover:shadow-lg transition-shadow">
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
                <span className={`badge ${property.trending === 'up' ? 'badge-green' : property.trending === 'down' ? 'badge-red' : 'badge-yellow'}`}>
                  {property.trending === 'up' ? '↑ Trending up' : property.trending === 'down' ? '↓ Trending down' : '→ Stable'}
                </span>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold text-secondary-900 dark:text-secondary-100 truncate">
                  {property.name}
                </h3>
              </div>
              <div className="mt-1 text-sm text-secondary-500 dark:text-secondary-400">
                {property.city}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center">
                  <span className="flex items-center text-amber-500">
                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-medium">{property.averageRating?.toFixed(1) ?? 'N/A'}</span>
                  </span>
                  <span className="ml-2 text-secondary-500 dark:text-secondary-400 text-sm">
                    ({property.reviewCount ?? 0} reviews)
                  </span>
                </div>
                <div>
                  <span className="badge badge-blue">
                    Top: {property.topCategory}
                  </span>
                </div>
              </div>
              <div className="mt-4 h-2 bg-secondary-200 dark:bg-secondary-700 rounded-full overflow-hidden">
                <div className="h-full bg-primary-500" style={{ width: `${((property.averageRating ?? 0) / 10) * 100}%` }}></div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
