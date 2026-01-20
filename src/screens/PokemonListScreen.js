import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { colors } from '../theme/colors';
import metrics from '../theme/metrics';
import PokemonCard from '../components/PokemonCard';
import SearchBar from '../components/SearchBar';
import { getPokemonsByType, getGenerationDetails } from '../services/api';

const fetchPokemonList = async ({ type, generation }) => {
    let formatted = [];

    if (generation) {
        const data = await getGenerationDetails(generation);
        if (data && data.pokemon_species) {
            formatted = data.pokemon_species.map(p => {
                const urlParts = p.url.split('/');
                const id = urlParts[urlParts.length - 2];
                return {
                    name: p.name,
                    url: p.url,
                    id: parseInt(id),
                };
            });
            // Sort by ID for generations
            formatted.sort((a, b) => a.id - b.id);
        }
    } else {
        const searchType = type || 'grass';
        const data = await getPokemonsByType(searchType);

        if (data && data.pokemon) {
            formatted = data.pokemon.map(p => {
                const urlParts = p.pokemon.url.split('/');
                const id = urlParts[urlParts.length - 2];
                return {
                    name: p.pokemon.name,
                    url: p.pokemon.url,
                    id: parseInt(id),
                };
            });
        }
    }
    return formatted;
};

const PokemonListScreen = ({ navigation, route }) => {
    const { type, generation, title } = route.params || {};

    const { data: pokemons = [], isLoading: loading } = useQuery({
        queryKey: ['pokemonList', { type, generation }],
        queryFn: () => fetchPokemonList({ type, generation }),
    });

    const renderItem = ({ item }) => (
        <PokemonCard
            name={item.name}
            id={item.id}
            style={styles.card}
            onPress={() => navigation.navigate('PokemonDetail', { pokemon: item, color: type ? (colors.types[type] || colors.primary) : colors.primary })}
        />
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{title || (type ? (type.charAt(0).toUpperCase() + type.slice(1) + " type") : "Pokemon")}</Text>
                {/*<View style={styles.filterButton}>
                    <Ionicons name="options" size={24} color={colors.text} />
                </View>*/}
            </View>

            <View style={styles.searchContainer}>
                <SearchBar placeholder="Search" style={styles.searchBar} />
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={pokemons}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.name}
                    numColumns={2}
                    contentContainerStyle={styles.listContent}
                    columnWrapperStyle={styles.columnWrapper}
                    showsVerticalScrollIndicator={false}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    windowSize={5}
                    removeClippedSubviews={true}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F7F7', // Slightly grey background for contrast with white cards
    },
    header: {
        paddingHorizontal: metrics.marginHorizontal,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.text,
        flex: 1,
        marginLeft: 10,
    },
    filterButton: {
        width: 40,
        height: 40,
        borderRadius: 20, // Circle?
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'white'? Filter icon usually just icon or in a circle
    },
    searchContainer: {
        paddingHorizontal: metrics.marginHorizontal,
        marginBottom: 10,
    },
    searchBar: {
        backgroundColor: 'white',
        borderWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
    },
    listContent: {
        paddingHorizontal: metrics.marginHorizontal,
        paddingBottom: 20,
        paddingTop: 10,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default PokemonListScreen;
