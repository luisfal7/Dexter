import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, metrics } from '../../../theme';
import { useTopTierPokemon, TopTierPokemon } from '../hooks/useTopTierPokemon';
import TopTierItem from '../components/TopTierItem';

// Screen component for Top Tier feature
// Español: Componente de pantalla para la funcionalidad Top Tier
const TopTierScreen: React.FC = () => {
    const router = useRouter();
    const { pokemonList, isLoading, loadingProgress, sortOrder, toggleSortOrder } = useTopTierPokemon();

    // Render item for FlatList
    // Español: Renderizar elemento para FlatList
    const renderItem = ({ item, index }: { item: TopTierPokemon, index: number }) => (
        <TopTierItem
            item={item}
            rank={index + 1}
            onPress={() => router.push(`/pokemon/${item.id}`)}
        />
    );

    const SortButton = () => (
        <TouchableOpacity style={styles.sortButton} onPress={toggleSortOrder}>
            <Ionicons
                name={sortOrder === 'desc' ? 'arrow-down' : 'arrow-up'}
                size={24}
                color="white"
            />
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: 'Top Tier Stats',
                    headerStyle: { backgroundColor: colors.location }, // Matching the card color
                    headerTintColor: '#fff',
                    headerRight: () => (
                        <TouchableOpacity onPress={toggleSortOrder} style={{ marginRight: 10 }}>
                            <Ionicons name={sortOrder === 'desc' ? "arrow-down-circle" : "arrow-up-circle"} size={28} color="white" />
                        </TouchableOpacity>
                    ),
                }}
            />

            <View style={styles.controls}>
                <Text style={styles.infoText}>
                    Ranking by Total Stats ({pokemonList.length} Pokemon)
                </Text>
                {/* Sort button in content as well requested explicitly */}
                <SortButton />
            </View>

            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.location} />
                    <Text style={styles.loadingText}>Calculating Stats... {loadingProgress}%</Text>
                    <Text style={{ fontSize: 12, color: '#999', marginTop: 5 }}>Fetching data for all generations</Text>
                </View>
            ) : (
                <FlatList
                    data={pokemonList}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: metrics.marginHorizontal,
        paddingVertical: 15,
    },
    infoText: {
        color: colors.grey,
        fontWeight: '600',
        fontSize: 14,
    },
    sortButton: {
        backgroundColor: colors.location,
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: colors.grey,
        fontSize: 16,
    },
    listContent: {
        paddingBottom: 20,
    }
});

export default TopTierScreen;
