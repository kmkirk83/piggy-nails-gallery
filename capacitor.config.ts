import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.nailed.app',
  appName: "Nail'd",
  webDir: 'dist/public',
  server: {
    url: 'https://naild.manus.space',
    cleartext: false,
  },
};

export default config;
