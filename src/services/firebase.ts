import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

// Initialize Firebase
export const initializeFirebase = async () => {
  try {
    // Configure Google Sign In
    GoogleSignin.configure({
      webClientId:
        '104513781610-pdiluku12qsr5e35hqtshvqu57urr9f5.apps.googleusercontent.com', // Get this from Firebase Console
      scopes: ['https://www.googleapis.com/auth/userinfo.profile'],
    });

    // Request notification permissions
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Notification permissions granted');
    }
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
};

// Authentication methods
export const signInWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(
      email,
      password,
    );
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(
      email,
      password,
    );
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

export const signInWithGoogle = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    const {idToken} = await GoogleSignin.getTokens();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    const userCredential = await auth().signInWithCredential(googleCredential);
    return userCredential.user;
  } catch (error) {
    console.log('🚀 ~ signInWithGoogle ~ error:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    await auth().signOut();
    await GoogleSignin.signOut();
  } catch (error) {
    throw error;
  }
};

// Messaging methods
export const getFCMToken = async () => {
  try {
    const token = await messaging().getToken();
    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};

export const onMessageReceived = (callback: (message: any) => void) => {
  return messaging().onMessage(callback);
};

export const onNotificationOpenedApp = (callback: (message: any) => void) => {
  return messaging().onNotificationOpenedApp(callback);
};

export const getInitialNotification = async () => {
  try {
    const message = await messaging().getInitialNotification();
    return message;
  } catch (error) {
    console.error('Error getting initial notification:', error);
    return null;
  }
};
