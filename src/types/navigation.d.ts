import {Pokemon} from './pokemon';

export type RootStackParamList = {
  Login: undefined;
  MainTabs: undefined;
  Details: {pokemon: Pokemon};
};

export type MainTabParamList = {
  Home: undefined;
  Settings: undefined;
};
