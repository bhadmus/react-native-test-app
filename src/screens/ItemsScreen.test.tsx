import { fireEvent, render, screen } from '@testing-library/react-native';
import { AppProvider } from '../state/AppContext';
import { SUCCESS_EMAIL, defaultState } from '../model/logic';
import { ItemsScreen } from './ItemsScreen';

jest.mock('@react-navigation/native', () => {
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useNavigation: () => ({ getParent: () => ({ navigate: jest.fn() }) }),
  };
});

describe('Items screen', () => {
  test('renders the first page and replaces it when the search changes', async () => {
    await render(
      <AppProvider initialState={{ ...defaultState(), sessionEmail: SUCCESS_EMAIL }}>
        <ItemsScreen />
      </AppProvider>,
    );

    expect(await screen.findByText('Item 001')).toBeTruthy();
    expect(screen.queryByText('Item 021')).toBeNull();

    await fireEvent.changeText(screen.getByTestId('items.searchInput'), 'Item 021');
    expect(await screen.findByText('Item 021')).toBeTruthy();
    expect(screen.queryByText('Item 001')).toBeNull();
  });
});
