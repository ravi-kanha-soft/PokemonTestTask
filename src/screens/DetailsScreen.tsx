import {RouteProp, useRoute} from '@react-navigation/native';
import {useQuery} from '@tanstack/react-query';
import React, {useRef} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import RBSheet from 'react-native-raw-bottom-sheet';
import {RootStackParamList} from '../types/navigation';
import {PokemonDetails} from '../types/pokemon';

type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;

const DetailsScreen = () => {
  const route = useRoute<DetailsScreenRouteProp>();
  const {pokemon} = route.params;
  const refRBSheet = useRef<any>(null);

  const {
    data: pokemonDetails,
    isLoading,
    error,
  } = useQuery<PokemonDetails>({
    queryKey: [],
    queryFn: async () => {
      try {
        const response = await fetch(pokemon.url);
        return response.json();
      } catch (error) {
        console.log('🚀 ~ queryFn: ~ error:', error);
      }
    },
  });

  const openBottomSheet = () => {
    refRBSheet?.current?.open();
  };

  if (error || !pokemonDetails) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error loading Pokemon details</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity onPress={openBottomSheet}>
          <Text
            style={[
              styles.pokemonName,
              {
                textDecorationLine: 'underline',
                color: 'blue',
                alignSelf: 'center',
              },
            ]}>
            {pokemonDetails.name}
          </Text>
        </TouchableOpacity>

        <View style={styles.detailsContainer}>
          <Text style={styles.sectionTitle}>Types</Text>
          <View style={styles.typesContainer}>
            {pokemonDetails.types.map(type => (
              <Text key={type.type.name} style={styles.type}>
                {type.type.name}
              </Text>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Abilities</Text>
          <View style={styles.abilitiesContainer}>
            {pokemonDetails.abilities.map(ability => (
              <Text key={ability.ability.name} style={styles.ability}>
                {ability.ability.name}
              </Text>
            ))}
          </View>
          <RBSheet
            ref={refRBSheet}
            height={Dimensions.get('screen').height / 2 + 100}
            openDuration={500}
            closeDuration={500}
            customStyles={{
              container: {
                justifyContent: 'center',
                alignItems: 'center',
              },
            }}>
            <FastImage
              source={{uri: pokemonDetails.sprites.front_default}}
              style={styles.pokemonImage}
              resizeMode="contain"
            />
            <Text style={styles.pokemonName}>{pokemonDetails.name}</Text>
            <View style={styles.statsContainer}>
              <View style={styles.stat}>
                <Text style={styles.statLabel}>Height</Text>
                <Text style={styles.statValue}>
                  {pokemonDetails.height / 10}m
                </Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statLabel}>Weight</Text>
                <Text style={styles.statValue}>
                  {pokemonDetails.weight / 10}kg
                </Text>
              </View>
            </View>
          </RBSheet>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
  },
  bottomSheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  pokemonImage: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  pokemonName: {
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    marginBottom: 20,
  },
  detailsContainer: {
    width: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
  },
  typesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  type: {
    backgroundColor: '#4a90e2',
    color: 'white',
    padding: 8,
    borderRadius: 15,
    marginRight: 10,
    marginBottom: 10,
    textTransform: 'capitalize',
  },
  abilitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  ability: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 15,
    marginRight: 10,
    marginBottom: 10,
    textTransform: 'capitalize',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 15,
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 16,
    color: '#666',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    marginTop: 20,
  },
});

export default DetailsScreen;
