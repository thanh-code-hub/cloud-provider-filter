import React from 'react';
import { act } from 'react-dom/test-utils';

import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';

describe('Testing App component', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders correctly', () => {
    const { container } = render(<App />);
    expect(container).toMatchSnapshot();
  });

  test('renders failed response', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(
      jest.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
          json: () =>
            Promise.resolve({
              detail: 'Testing: some error message',
            }),
        }),
      ) as jest.Mock,
    );

    act(() => {
      render(<App />);
    });
    await waitFor(() => {
      expect(screen.getByRole('provider-table-error-row')).toBeInTheDocument();
      expect(screen.getByText('Failed to fetch cloud providers')).toBeInTheDocument();
    });
  });

  test('renders successful response', async () => {
    jest.spyOn(global, 'fetch').mockImplementation(
      jest.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () =>
            Promise.resolve([
              {
                cloud_description: 'Africa, South Africa - Amazon Web Services: Cape Town',
                cloud_name: 'aws-af-south-1',
                geo_latitude: -3.92,
                geo_longitude: 1.42,
                provider: 'aws',
                provider_description: 'Amazon Web Services',
              },
              {
                cloud_description: 'Africa, South Africa - Azure: South Africa North',
                cloud_name: 'azure-south-africa-north',
                geo_latitude: -25.734,
                geo_longitude: 21.21,
                provider: 'azure',
                provider_description: 'Microsoft Azure',
              },
              {
                cloud_description: 'Africa, South Africa - Google Cloud: Johannesburg',
                cloud_name: 'google-africa-south1',
                geo_latitude: -16.1215,
                geo_longitude: 22.0229,
                provider: 'google',
                provider_description: 'Google Cloud Platform',
              },
            ]),
        }),
      ) as jest.Mock,
    );

    act(() => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByRole('provider-table-body')).toBeInTheDocument();
      expect(screen.getAllByRole('provider-table-row')).toHaveLength(3);
    });
  });
});
