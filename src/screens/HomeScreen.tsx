import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationProp, useNavigation} from '@react-navigation/native';
import {useQuery} from '@tanstack/react-query';
import moment from 'moment-timezone';
import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useAuth} from '../contexts/AuthContext';
import {RootStackParamList} from '../types/navigation';
import {Pokemon, PokemonListResponse} from '../types/pokemon';

const ITEMS_PER_PAGE = 20;

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {user} = useAuth();

  const [offset, setOffset] = useState(0);
  const [pokemonData, setPokemonData] = useState<Pokemon[]>([]);
  const [greeting, setGreeting] = useState('');
  const onEndReachedCalledDuringMomentum = useRef(true);

  const [buttonStates, setButtonStates] = useState({
    catchPokemon: false,
    viewTeam: false,
    settings: false,
  });

  // Set greeting message based on NYC time
  useEffect(() => {
    const nycTime = moment().tz('America/New_York');
    const currentGreeting = getGreetingBasedOnTime(nycTime.hour());
    setGreeting(currentGreeting);
  }, []);

  const getGreetingBasedOnTime = (hours: number) => {
    if (hours >= 5 && hours < 10) return 'Good Morning, NYC!';
    if (hours >= 10 && hours < 12) return 'Late Morning Vibes!';
    if (hours >= 12 && hours < 17) return 'Good Afternoon, NYC!';
    if (hours >= 17 && hours < 21) return 'Good Evening, NYC!';
    return 'Night Owl in NYC!';
  };

  // Load button states from AsyncStorage
  useEffect(() => {
    const loadButtonStates = async () => {
      try {
        const savedStates = await AsyncStorage.getItem('buttonStates');
        if (savedStates) {
          setButtonStates(JSON.parse(savedStates));
        }
      } catch (error) {
        console.error('Error loading button states:', error);
      }
    };
    loadButtonStates();
  }, []);

  // Save updated button states to AsyncStorage
  const saveButtonStates = async (newStates: typeof buttonStates) => {
    try {
      await AsyncStorage.setItem('buttonStates', JSON.stringify(newStates));
    } catch (error) {
      console.error('Error saving button states:', error);
    }
  };

  // Fetch Pokémon list
  const {data, isLoading, error} = useQuery<PokemonListResponse>({
    queryKey: ['pokemon', offset],
    queryFn: async () => {
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${ITEMS_PER_PAGE}&offset=${offset}`,
      );
      return response.json();
    },
  });

  // Append new Pokémon data to the list
  useEffect(() => {
    if (data?.results) {
      setPokemonData(prev => [...prev, ...data.results]);
    }
  }, [data?.results]);

  // Handle button press toggle
  const handleButtonPress = (buttonName: keyof typeof buttonStates) => {
    const newStates = {
      ...buttonStates,
      [buttonName]: !buttonStates[buttonName],
    };
    setButtonStates(newStates);
    saveButtonStates(newStates);
  };

  // Render each Pokémon item
  const renderPokemonItem = ({item}: {item: Pokemon}) => (
    <TouchableOpacity
      style={styles.pokemonItem}
      onPress={() => navigation.navigate('Details', {pokemon: item})}>
      <Text style={styles.pokemonName}>{item.name}</Text>
    </TouchableOpacity>
  );

  // Error screen
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error loading Pokémon</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>
          Welcome, {user?.displayName || 'Trainer'}!
        </Text>
        {user?.photoURL && (
          <FastImage
            source={{uri: user.photoURL}}
            style={styles.profileImage}
          />
        )}
      </View>

      {/* Greeting Message */}
      <Text style={styles.greetingText}>{greeting}</Text>

      {/* Button Row */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            buttonStates.catchPokemon && styles.buttonActive,
          ]}
          onPress={() => handleButtonPress('catchPokemon')}>
          <Text style={styles.buttonText}>Catch Pokémon</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, buttonStates.viewTeam && styles.buttonActive]}
          onPress={() => handleButtonPress('viewTeam')}>
          <Text style={styles.buttonText}>View Team</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, buttonStates.settings && styles.buttonActive]}
          onPress={() => handleButtonPress('settings')}>
          <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Pokémon List */}
      <FlatList
        data={pokemonData}
        renderItem={renderPokemonItem}
        keyExtractor={item => item.name}
        onEndReached={() => {
          if (data?.next) {
            setOffset(prev => prev + ITEMS_PER_PAGE);
          }
        }}
        ListFooterComponent={
          isLoading ? <ActivityIndicator size="large" color="#4a90e2" /> : null
        }
        onEndReachedThreshold={0.9}
        onMomentumScrollBegin={() => {
          onEndReachedCalledDuringMomentum.current = false;
        }}
        initialNumToRender={5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'white',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  greetingText: {
    fontSize: 36,
    fontWeight: 'bold',
    paddingBottom: 20,
    textAlign: 'center',
    backgroundColor: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: 'white',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#4a90e2',
    minWidth: 100,
  },
  buttonActive: {
    backgroundColor: '#2c5282',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  pokemonItem: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 5,
    marginHorizontal: 10,
    borderRadius: 10,
    elevation: 2,
  },
  pokemonName: {
    fontSize: 16,
    textTransform: 'capitalize',
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    marginTop: 20,
  },
});

export default HomeScreen;
