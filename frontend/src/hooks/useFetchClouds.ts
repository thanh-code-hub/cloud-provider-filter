import { useEffect, useState } from 'react';
import { CloudProvider, Location, ErrorResponse } from '../types/types';

const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:3000';

const useFetchClouds = () => {
  const [cloudProviders, setCloudProviders] = useState<CloudProvider[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClouds = async (provider?: string, location?: Location) => {
    setIsLoading(true);
    setError(null);

    try {
      let queryString = '';
      if (provider) {
        queryString += `?provider=${encodeURIComponent(provider)}`;
      }
      if (location) {
        if (!location?.lat || !location?.lon) {
          throw new Error('Invalid location coordinates provided');
        }
        queryString += `${queryString ? '&' : '?'}lonLat=${encodeURIComponent(location.lon)}%2C${encodeURIComponent(
          location.lat,
        )}`;
      }

      const url = `${BASE_URL}/clouds${queryString}`;

      const response = await fetch(url).catch(() => {
        throw new Error('Network error occurred while fetching clouds');
      });

      if (!response.ok) {
        let errorMessage = `Failed to fetch clouds (Status: ${response.status})`;
        try {
          const errorData: ErrorResponse = (await response.json()) as ErrorResponse;
          errorMessage += ` - ${errorData.detail}`;
        } catch {
          errorMessage += ' - Unable to parse error details';
        }
        throw new Error(errorMessage);
      }

      const data = (await response.json()) as CloudProvider[];

      if (!Array.isArray(data)) {
        throw new Error('Invalid response format received from server');
      }

      setCloudProviders(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      console.error('Error fetching cloud providers:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = () => {
      try {
        fetchClouds().catch((error) => {
          throw error;
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        console.error('Error in useFetchClouds:', errorMessage);
        setError(errorMessage);
      }
    };

    fetchData();
  }, []);

  return { cloudProviders, isLoading, error, fetchClouds };
};

export default useFetchClouds;
