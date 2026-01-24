import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, metrics } from '../../../theme';
import PokemonCard from './PokemonCard';
import { SearchBar } from '../../../components';

const PokemonListView = ({
    pokemons,
    loading,
    onSelectPokemon,
    onBack,
    title,
    type,
    generation
}) => {

    const renderItem = ({ item }) => (
        <PokemonCard
            name={item.name}
            id={item.id}
            style={styles.card}
            onPress={() => onSelectPokemon(item)}
        />
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    {title || (type ? (type.charAt(0).toUpperCase() + type.slice(1) + " type") : "Pokemon")}
                </Text>
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
        backgroundColor: '#F7F7F7',
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
    },
    card: {
        flex: 1,
    }
});

export default PokemonListView;
