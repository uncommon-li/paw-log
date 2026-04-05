import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.pawlog.app',
  appName: 'Paw Log',
  webDir: 'out',
  plugins: {
    StatusBar: {
      style: 'LIGHT',
      backgroundColor: '#f472b6',
      overlaysWebView: true,
    },
    SplashScreen: {
      launchShowDuration: 1200,
      backgroundColor: '#fff0f7',
      showSpinner: false,
      androidScaleType: 'CENTER_CROP',
    },
  },
}

export default config
