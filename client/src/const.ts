export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

import { Capacitor } from "@capacitor/core";

const PRODUCTION_URL = 'https://naild.manus.space';

// When running inside a Capacitor APK, window.location.origin is
// "capacitor://localhost" which is not a valid OAuth redirect URI.
// Use the production URL origin instead.
const getOrigin = () =>
  Capacitor.isNativePlatform() ? PRODUCTION_URL : window.location.origin;

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  const redirectUri = `${getOrigin()}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};
