import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid, Platform} from 'react-native';
import {navigationRef} from '../navigation/AppNavigator';
import {
  getFCMToken,
  getInitialNotification,
  onMessageReceived,
  onNotificationOpenedApp,
} from './firebase';

export const initializeNotifications = async () => {
  try {
    // Request permission for iOS
    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Notification permissions granted');
      }
    } else {
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Notification permission granted');
          } else {
            console.log('Notification permission denied');
          }
        } catch (err) {
          console.warn(err);
        }
      }
    }

    // Get FCM token
    const token = await getFCMToken();
    console.log('FCM Token:', token);

    // Handle foreground messages
    const unsubscribeForeground = onMessageReceived(remoteMessage => {
      console.log('Foreground Message:', remoteMessage);
      const data = {
        name: 'bulbasaur',
        url: 'https://pokeapi.co/api/v2/pokemon/1/',
      };
      navigationRef?.current?.navigate('Details', {pokemon: data});
      // You can show a local notification here
    });

    // Handle background/quit state messages
    const unsubscribeBackground = onNotificationOpenedApp(remoteMessage => {
      console.log('Background Message:', remoteMessage);
      const data = {
        name: 'bulbasaur',
        url: 'https://pokeapi.co/api/v2/pokemon/1/',
      };
      navigationRef?.current?.navigate('Details', {pokemon: data});
      // Handle navigation here
    });

    // Check if app was opened from a notification
    const initialNotification = await getInitialNotification();
    if (initialNotification) {
      console.log('Initial Notification:', initialNotification);
      const data = {
        name: 'bulbasaur',
        url: 'https://pokeapi.co/api/v2/pokemon/1/',
      };
      navigationRef?.current?.navigate('Details', {pokemon: data});
      // Handle navigation here
    }

    return () => {
      unsubscribeForeground();
      unsubscribeBackground();
    };
  } catch (error) {
    console.error('Failed to initialize notifications:', error);
  }
};

// Function to send a local notification (for testing)
export const sendLocalNotification = async (title: string, body: string) => {
  try {
    // For local notifications, we'll use the onMessage handler
    // This will only work when the app is in the foreground
    messaging().onMessage(async remoteMessage => {
      console.log('Received local notification:', remoteMessage);
      // Here you can implement your own local notification UI
      // For example, you could use react-native-push-notification
      // or show a custom alert
    });

    // Trigger a message
    const message = {
      data: {
        type: 'pokemon',
        title,
        body,
        timestamp: Date.now().toString(),
      },
    };

    // Simulate receiving a message
    messaging().onMessage(remoteMessage => {
      console.log('A new message arrived!', JSON.stringify(message));
    });
  } catch (error) {
    console.error('Failed to send local notification:', error);
  }
};
