import { useCallback } from 'react';
import './App.css';
import { CloudProvider, Location } from './types/types';
import LocationSearchForm from './components/locationSearchForm';
import useFetchClouds from './hooks/useFetchClouds';

function App() {
  const { cloudProviders, isLoading, error, fetchClouds } = useFetchClouds();

  const handleLocationFound = (provider?: string, location?: Location) => {
    fetchClouds(provider, location).catch((error) => {
      console.error('Error filtering clouds provider:', error);
    });
  };

  const contentRenderer = useCallback(() => {
    if (isLoading) {
      return (
        <tr>
          <td colSpan={4} style={{ textAlign: 'center' }} role="provider-table-loading-row">
            Loading cloud data...
          </td>
        </tr>
      );
    }
    if (error) {
      return (
        <tr>
          <td colSpan={4} style={{ textAlign: 'center' }} role="provider-table-error-row">
            Failed to fetch cloud providers
          </td>
        </tr>
      );
    }
    if (cloudProviders.length) {
      return cloudProviders.map((cloudProvider: CloudProvider) => (
        <tr key={cloudProvider.cloud_name} role="provider-table-row">
          <td>{cloudProvider.cloud_name}</td>
          <td>{cloudProvider.cloud_description}</td>
          <td>{cloudProvider.provider}</td>
          <td>{cloudProvider.provider_description}</td>
        </tr>
      ));
    }
    return (
      <tr>
        <td colSpan={4} style={{ textAlign: 'center' }} role="provider-table-empty-row">
          No cloud providers found
        </td>
      </tr>
    );
  }, [isLoading, cloudProviders, error]);

  return (
    <div role="root-container">
      <LocationSearchForm onLocationFound={handleLocationFound} disabled={isLoading} />
      <table role="provider-table">
        <thead>
          <tr>
            <th>Cloud Name</th>
            <th>Cloud Description</th>
            <th>Provider</th>
            <th>Provider Description</th>
          </tr>
        </thead>
        <tbody role="provider-table-body">{contentRenderer()}</tbody>
      </table>
    </div>
  );
}

export default App;
