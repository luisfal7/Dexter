import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, metrics } from '../../../theme';
import PokemonCard from './PokemonCard';

const FavoritesView = ({ favorites, onSelectPokemon, onBack }) => {

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
                <Text style={styles.headerTitle}>Favorites</Text>
            </View>

            {favorites.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="heart-dislike-outline" size={64} color={colors.grey} />
                    <Text style={styles.emptyText}>No favorites yet!</Text>
                </View>
            ) : (
                <FlatList
                    data={favorites}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    contentContainerStyle={styles.listContent}
                    columnWrapperStyle={styles.columnWrapper}
                    showsVerticalScrollIndicator={false}
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
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.text,
        marginLeft: 10,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        marginTop: 10,
        fontSize: 18,
        color: colors.grey,
    },
    listContent: {
        paddingHorizontal: metrics.marginHorizontal,
        paddingBottom: 20,
        paddingTop: 10,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    card: {
        flex: 1,
    }
});

export default FavoritesView;
