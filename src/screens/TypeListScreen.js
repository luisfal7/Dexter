import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import metrics from '../theme/metrics';
import CategoryCard from '../components/CategoryCard';
import SearchBar from '../components/SearchBar';
import { getTypes } from '../services/api';

const typeIcons = {
  normal: 'disc',
  fire: 'flame',
  water: 'water',
  electric: 'flash',
  grass: 'leaf',
  ice: 'snow',
  fighting: 'fitness',
  poison: 'skull',
  ground: 'planet',
  flying: 'cloud',
  psychic: 'eye',
  bug: 'bug',
  rock: 'cube',
  ghost: 'happy', // Placeholder
  dragon: 'logo-snapchat', // Placeholder (looks like a ghost/monster?)
  steel: 'build',
  fairy: 'star',
  dark: 'moon',
};

const TypeListScreen = ({ navigation }) => {
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app we would fetch from API, but for UI speed/reliability in demo 
    // and because colors/icons are hardcoded, I'll generate the list from the colors map first
    // then maybe verify with API if needed. For now, static list is better for the visual task.
    const staticTypes = Object.keys(colors.types).map(type => ({
      name: type,
      url: `https://pokeapi.co/api/v2/type/${type}`
    }));
    setTypes(staticTypes);
    setLoading(false);
  }, []);

  const renderItem = ({ item }) => {
    const color = colors.types[item.name] || colors.grey;
    const icon = typeIcons[item.name] || 'ellipse';

    return (
      <CategoryCard
        title={item.name.charAt(0).toUpperCase() + item.name.slice(1)}
        color={color}
        icon={icon}
        style={styles.card}
        onPress={() => navigation.navigate('PokemonList', { type: item.name })}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Types</Text>
      </View>

      <View style={styles.searchContainer}>
        <Text style={styles.searchTitle}>Search Type</Text>
        {/* Wait, design shows just "Search Type" text? No, it's a placeholder in a search bar? 
              Screen 2 Image: "Search Type" is placeholder text in the search bar.
           */}
        <SearchBar placeholder="Search Type" style={styles.searchBar} />
      </View>

      <FlatList
        data={types}
        renderItem={renderItem}
        keyExtractor={(item) => item.name}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: metrics.marginHorizontal,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  searchContainer: {
    paddingHorizontal: metrics.marginHorizontal,
    marginBottom: 10,
  },
  searchBar: {
    backgroundColor: colors.lightGrey,
    elevation: 0, // Flat look
  },
  listContent: {
    paddingHorizontal: metrics.marginHorizontal,
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  card: {
    flex: 0.48, // slightly less than half to fit space
    marginBottom: 15,
    height: 60, // Shorter than Home screen cards?
    // Screen 2 cards look like standard height button
  }
});

export default TypeListScreen;
