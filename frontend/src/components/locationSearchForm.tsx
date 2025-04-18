import { useState, FormEvent } from 'react';
import { Location } from '../types/types';

interface LocationSearchFormProps {
  onLocationFound: (provider?: string, location?: Location) => void;
  disabled: boolean;
}

const GEO_LOCATION_API =
  process.env.REACT_APP_GEO_LOCATION_API || 'https://nominatim.openstreetmap.org/search?format=json&q=';

const LocationSearchForm = ({ onLocationFound, disabled }: LocationSearchFormProps) => {
  const [location, setLocation] = useState<string>('');
  const [foundLocation, setFoundLocation] = useState<Location | null>(null);
  const [provider, setProvider] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (location.trim()) {
      setIsLoading(true);
      fetch(`${GEO_LOCATION_API}${encodeURIComponent(location)}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch location data');
          }
          return response.json();
        })
        .then((data: Location[]) => {
          if (data.length > 0) {
            setFoundLocation(data[0]);
            onLocationFound(provider, data[0]);
          } else {
            setError('No location found');
            setFoundLocation(null);
          }
        })
        .catch((err) => {
          setError(`Error: ${err as string}`);
          console.error('Error:', err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      onLocationFound(provider);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} role="filter-form">
        <fieldset disabled={disabled} style={{ border: 'none', padding: 0, margin: 0 }}>
          <input
            type="text"
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            placeholder="Enter provider"
            disabled={isLoading}
            role="provider-search-input"
          />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter location or address"
            disabled={isLoading}
            role="location-search-input"
          />
          <button type="submit" disabled={isLoading} role="search-button">
            {isLoading ? 'Searching...' : 'Search cloud provider'}
          </button>
          <button
            role="clear-button"
            onClick={(e: FormEvent) => {
              e.preventDefault();
              setLocation('');
              setProvider('');
              setError('');
            }}
          >
            Clear
          </button>
        </fieldset>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
      {!isLoading && foundLocation && <p>Sort providers by distance from {foundLocation.display_name}</p>}
    </div>
  );
};

export default LocationSearchForm;
