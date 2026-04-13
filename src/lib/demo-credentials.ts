/**
 * Local QA credentials. The account must exist in your Firebase project:
 * register once at /signup with this email and password, or add the user in
 * Firebase Console → Authentication.
 *
 * Shown on the login page only when NODE_ENV === "development".
 */
export const DEMO_LOGIN_EMAIL = 'demo@fitcv.test';
export const DEMO_LOGIN_PASSWORD = 'FitCV-Demo-2024!';

export function isDemoLoginUiEnabled(): boolean {
  return process.env.NODE_ENV === 'development';
}
