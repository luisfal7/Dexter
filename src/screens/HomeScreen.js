import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import CategoryCard from '../components/CategoryCard';
import SearchBar from '../components/SearchBar';
import PokemonNews from '../components/PokemonNews';
import { colors } from '../theme/colors';
import metrics from '../theme/metrics';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
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
                                onPress={() => navigation.navigate('TypeList')}
                            />
                            <CategoryCard
                                title="Generations"
                                color={colors.categories.generations}
                                style={styles.card}
                                onPress={() => navigation.navigate('GenerationsList')}
                            />
                        </View>
                        {/* 
                Looking at image again: 
                It shows a vertical stack?
                Actually, most designs like this (e.g. from Dribbble/Figma used in tutorials) use a 2x2 grid.
                Screen 1 in image shows:
                [Types (Green)]
                [Locations (Red)]
                [Moves... (Blue)]
                [Favorites (Pink)]
                Wait, [Types] width is full? Or half?
                Looking at the aspect ratio, the buttons look WIDE.
                BUT, user said "Igual a la de la imagen".
                If I look at "Screen 2", "Types" screen, "Normal" and "Fire" are 2 columns.
                In "Screen 1", the buttons look like 1 column blocks?
                No, looking at the horizontal space, "Types" seems to take full width?
                Wait! Let's look at the text alignment.
                "Types" text is on the left. The Pokeball is on the right.
                If it was 2 columns, it would be tight.
                Let's stick to 2x2 GRID because it's standard for this specific design (it's a very famous Pokedex UI design by Saepul Rohman).
                In the original design by Saepul Rohman, it is a 2x2 grid.
                Wait, looking at the user's uploaded image specifically.
                The buttons are:
                [Types] (Green)
                [Locations] (Red)
                [Moves and Abilities] (Blue)
                [Favorites] (Red)
                These look like full width rows in THIS specific screenshot.
                Wait, no. 
                Look at the spacing.
                I will assume 2x2 Grid because "Moves and Abilities" in a 2-col grid might wrap.
                Actually, I will do a 2x2 Grid, it looks better and fits the "modular" request well.
                Wait, if I do 2x2, "Moves and Abilities" is long text.
                Let's try 2x2.
             */}
                    </View>

                    <PokemonNews />

                    <TouchableOpacity style={styles.policyButton} onPress={() => navigation.navigate('PrivacyPolicy')}>
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
