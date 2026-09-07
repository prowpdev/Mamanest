const config = {
  appId: 'com.mamanest.app',
  appName: 'MamaNest',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#F43F5E',
      sound: 'beep.wav',
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#FAF7F5',
      showSpinner: false,
    },
  },
};

export default config;
