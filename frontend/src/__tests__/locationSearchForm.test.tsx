import { fireEvent, waitFor } from '@testing-library/react';
import { render, screen } from '@testing-library/react';
import LocationSearchForm from '../components/locationSearchForm';

describe('LocationSearchForm', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly', () => {
    const { container } = render(<LocationSearchForm onLocationFound={() => {}} disabled={false} />);
    expect(container).toMatchSnapshot();
  });

  test('test failing location search', async () => {
    jest.spyOn(global, 'fetch').mockImplementationOnce(
      jest.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve([]),
        }),
      ) as jest.Mock,
    );

    render(<LocationSearchForm onLocationFound={() => {}} disabled={false} />);

    fireEvent.change(screen.getByRole('location-search-input'), { target: { value: 'zzpzzpzpzpzp' } });
    fireEvent.click(screen.getByRole('search-button'));

    await waitFor(() => {
      expect(screen.getByText('No location found')).toBeInTheDocument();
    });
  });
});
