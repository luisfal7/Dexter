import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import CategoryCard from '../components/CategoryCard';
import { SearchBar } from '../../../components';
import { PokemonNews } from '../../news/components';
import { colors, metrics } from '../../../theme';

const { width } = Dimensions.get('window');

import { useRouter } from 'expo-router';

// ... (imports)

// Remove HomeScreenProps interface as we don't need navigation prop anymore

const HomeScreen: React.FC = () => {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <StatusBar style="light" backgroundColor="transparent" translucent />

            {/* Red Background Curve */}
            <View style={styles.backgroundContainer}>
                <View style={styles.redBackground} />
                {/* Pokeball background decoration */}
                <View style={styles.pokeballDecoration} />
            </View>

            <SafeAreaView style={styles.safeArea}>
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >

                    <Text style={styles.headerTitle}>Pokédex</Text>
                    <Text style={styles.subTitle}>Find your favorite Pokemon</Text>

                    <SearchBar placeholder="Search" style={styles.searchBar} />

                    <View style={styles.categories}>
                        <View style={styles.row}>
                            <CategoryCard
                                title="Types"
                                color={colors.categories.types}
                                style={[styles.card, { marginRight: 10 }]}
                                onPress={() => router.push('/types')}
                            />
                            <CategoryCard
                                title="Generations"
                                color={colors.categories.generations}
                                style={styles.card}
                                onPress={() => router.push('/generations')}
                            />
                        </View>
                        <View style={styles.row}>
                            <CategoryCard
                                title="Favorites"
                                color={colors.primary}
                                style={[styles.card, { marginRight: 10 }]}
                                onPress={() => router.push('/favorites')}
                                icon="heart"
                            />
                            <CategoryCard
                                title="Locations"
                                color="#7C538C"
                                style={styles.card}
                                onPress={() => { }} // Placeholder
                                icon="map"
                            />
                        </View>
                        {/* 2x2 Grid maintained */}
                    </View>

                    <PokemonNews />

                    <TouchableOpacity style={styles.policyButton} onPress={() => router.push('/privacy')}>
                        <Text style={styles.policyText}>Privacy Policy</Text>
                    </TouchableOpacity>

                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    backgroundContainer: {
        position: 'absolute',
        top: 0,
        width: width,
        height: 420, // Covers enough for the curve
        backgroundColor: 'transparent',
        overflow: 'hidden',
    },
    redBackground: {
        backgroundColor: colors.primary,
        height: 380, // Main red height
        width: width,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        position: 'absolute',
        top: 0,
    },
    pokeballDecoration: {
        position: 'absolute',
        top: -50,
        right: -50,
        width: 250,
        height: 250,
        borderRadius: 125,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    safeArea: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: metrics.marginHorizontal,
        paddingTop: 40,
        paddingBottom: 40,
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.textLight,
        marginTop: 20,
    },
    subTitle: {
        fontSize: 16, // Smaller than header
        fontWeight: '600',
        color: colors.textLight,
        marginTop: 5,
        marginBottom: 40,
        opacity: 0.9,
    },
    searchBar: {
        marginBottom: 30,
        zIndex: 1, // Ensure dropdown floats on top of categories
    },
    categories: {
        marginBottom: 30,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    card: {
        flex: 1, // Grid specific
    },
    policyButton: {
        alignItems: 'center',
        padding: 20,
        marginBottom: 20,
    },
    policyText: {
        color: colors.grey,
        fontSize: 14,
        textDecorationLine: 'underline',
    },
});

export default HomeScreen;
