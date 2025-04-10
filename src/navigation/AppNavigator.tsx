import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React, {createRef} from 'react';
import {useAuth} from '../contexts/AuthContext';

// Import screens (we'll create these next)
import DetailsScreen from '../screens/DetailsScreen';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export const navigationRef = createRef<NavigationContainerRef<any>>();
export const AppNavigator = () => {
  const {user, loading} = useAuth();

  if (loading) {
    // You might want to show a loading screen here
    return null;
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        screenOptions={{
          headerBackTitle: '',
        }}>
        {user ? (
          // Authenticated stack
          <>
            <Stack.Screen
              name="Home"
              component={MainTabs}
              options={{headerShown: false, headerBackTitle: 'Home'}}
            />
            <Stack.Screen
              name="Details"
              component={DetailsScreen}
              options={{title: 'Pokemon Details', headerBackTitle: ''}}
            />
          </>
        ) : (
          // Auth stack
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{headerShown: false}}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
