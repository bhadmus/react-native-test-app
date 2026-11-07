import { fireEvent, render, screen } from '@testing-library/react-native';
import { AppText } from '../components/AppText';
import { defaultState } from '../model/logic';
import { AppProvider, useApp } from '../state/AppContext';
import { LoginScreen } from './LoginScreen';

function SessionProbe() {
  const { state } = useApp();
  return <AppText testID="probe.session">{state.sessionEmail ?? ''}</AppText>;
}

async function renderLogin() {
  await render(
    <AppProvider initialState={defaultState()}>
      <LoginScreen />
      <SessionProbe />
    </AppProvider>,
  );
}

describe('Login screen', () => {
  test('shows both empty-field messages', async () => {
    await renderLogin();
    await fireEvent.press(screen.getByTestId('login.submitButton'));
    expect(screen.getByText('Email is required')).toBeTruthy();
    expect(screen.getByText('Password is required')).toBeTruthy();
  });

  test('clears the banner when a field changes', async () => {
    await renderLogin();
    await fireEvent.press(screen.getByTestId('login.submitButton'));
    await fireEvent.changeText(screen.getByTestId('login.emailInput'), 'a');
    expect(screen.queryByText('Email is required')).toBeNull();
    expect(screen.queryByText('Password is required')).toBeNull();
  });

  test('locks the locked account and rejects other passwords', async () => {
    await renderLogin();
    await fireEvent.changeText(screen.getByTestId('login.emailInput'), 'locked@example.com');
    await fireEvent.changeText(screen.getByTestId('login.passwordInput'), 'nope');
    await fireEvent.press(screen.getByTestId('login.submitButton'));
    expect(await screen.findByText('Account locked')).toBeTruthy();

    await fireEvent.changeText(screen.getByTestId('login.emailInput'), 'other@example.com');
    await fireEvent.changeText(screen.getByTestId('login.passwordInput'), 'Password123!');
    await fireEvent.press(screen.getByTestId('login.submitButton'));
    expect(await screen.findByText('Invalid credentials')).toBeTruthy();
  });

  test('creates an account and signs that student in', async () => {
    await renderLogin();
    await fireEvent.press(screen.getByTestId('login.signupLink'));
    await fireEvent.changeText(screen.getByTestId('signup.emailInput'), 'ada@example.com');
    await fireEvent.changeText(screen.getByTestId('signup.passwordInput'), 'secret');
    await fireEvent.changeText(screen.getByTestId('signup.confirmInput'), 'secret');
    await fireEvent.press(screen.getByTestId('signup.submitButton'));
    expect(await screen.findByTestId('probe.session')).toHaveTextContent('ada@example.com');
  });

  test('stores the student session', async () => {
    await renderLogin();
    await fireEvent.changeText(screen.getByTestId('login.emailInput'), 'student@example.com');
    await fireEvent.changeText(screen.getByTestId('login.passwordInput'), 'Password123!');
    await fireEvent.press(screen.getByTestId('login.submitButton'));
    expect(await screen.findByTestId('probe.session')).toHaveTextContent(
      'student@example.com',
    );
  });
});
