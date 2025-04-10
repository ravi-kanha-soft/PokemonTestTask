/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import React, {useEffect} from 'react';
import {AuthProvider} from './src/contexts/AuthContext';
import {AppNavigator} from './src/navigation/AppNavigator';
import {initializeFirebase} from './src/services/firebase';
import {initializeNotifications} from './src/services/notifications';

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const setup = async () => {
      await initializeFirebase();
      await initializeNotifications();
    };
    setup();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
