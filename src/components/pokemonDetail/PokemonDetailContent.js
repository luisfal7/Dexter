import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { colors } from '../../theme/colors';
import metrics from '../../theme/metrics';
import { getPokemonDetails, getPokemonSpecies } from '../../services/api';
import PokemonHeader from './PokemonHeader';
import PokemonAbout from './PokemonAbout';
import PokemonStats from './PokemonStats';
import PokemonMoves from './PokemonMoves';
import PokemonEvolution from './PokemonEvolution';
import PokemonTypeMatchups from './PokemonTypeMatchups';

const PokemonDetailContent = ({ pokemon, color, onBackPressed }) => {
    const [activeTab, setActiveTab] = useState('About');
    const [backgroundColor, setBackgroundColor] = useState(color);
    const [isShiny, setIsShiny] = useState(false);

    // Determine URL
    let detailUrl = pokemon.url;
    if (pokemon.id) {
        detailUrl = `https://pokeapi.co/api/v2/pokemon/${pokemon.id}`;
    } else if (pokemon.url && pokemon.url.includes('pokemon-species')) {
        const parts = pokemon.url.split('/');
        const id = parts[parts.length - 2];
        detailUrl = `https://pokeapi.co/api/v2/pokemon/${id}`;
    }

    const { data: details, isLoading: loadingDetails } = useQuery({
        queryKey: ['pokemonDetails', detailUrl],
        queryFn: () => getPokemonDetails(detailUrl),
        enabled: !!detailUrl,
    });

    const { data: species, isLoading: loadingSpecies } = useQuery({
        queryKey: ['pokemonSpecies', details?.id],
        queryFn: () => getPokemonSpecies(pokemon.id || details?.id),
        enabled: !!details?.id || !!pokemon.id,
    });

    useEffect(() => {
        if (details && details.types && details.types.length > 0) {
            const type = details.types[0].type.name;
            const typeColor = colors.types[type];
            if (typeColor) {
                setBackgroundColor(typeColor);
            }
        }
    }, [details]);

    const renderTabContent = () => {
        if (!details || !species) return null;

        const flavor = species.flavor_text_entries.find(entry => entry.language.name === 'en');
        const description = flavor ? flavor.flavor_text.replace(/\n|\f/g, ' ') : '';

        switch (activeTab) {
            case 'About':
                return (
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <PokemonAbout
                            description={description}
                            height={details.height}
                            weight={details.weight}
                        />
                        <PokemonEvolution
                            evolutionUrl={species.evolution_chain?.url}
                            isShiny={isShiny}
                            currentPokemonId={details.id}
                        />
                        <PokemonTypeMatchups types={details.types} />
                    </ScrollView>
                );
            case 'Status':
                return (
                    <PokemonStats
                        stats={details.stats}
                        color={backgroundColor}
                    />
                );
            case 'Moves':
                return (
                    <PokemonMoves
                        moves={details.moves}
                    />
                )
            default:
                return null;
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: backgroundColor }]}>
            <PokemonHeader
                pokemon={pokemon}
                details={details}
                backgroundColor={backgroundColor}
                isShiny={isShiny}
                setIsShiny={setIsShiny}
                onBackPressed={onBackPressed}
            />

            <View style={styles.bottomSheet}>
                <View style={styles.tabContainer}>
                    {['About', 'Status', 'Moves'].map(tab => (
                        <TouchableOpacity
                            key={tab}
                            onPress={() => setActiveTab(tab)}
                            style={[styles.tab, activeTab === tab && styles.activeTab]}
                        >
                            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
                            {activeTab === tab && <View style={styles.activeLine} />}
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.contentArea}>
                    {renderTabContent()}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    bottomSheet: {
        flex: 1,
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        // Adjusted margin top to account for the header height which is now in a component
        // But since the header component is fixed height implicitly by its content, we might need to be careful.
        // The original code had marginTop: 200, which pushed the white sheet down.
        // The header component is rendered ABOVE this view in normal flow.
        // However, the original header used a lot of absolute positioning AND normal flow.
        // In the original:
        // Header was normal flow (SafeAreaView).
        // Image was absolute.
        // BottomSheet had marginTop: 200.
        // So the BottomSheet was overlapping or positioned relative to the container top.
        // Wait, if Header is normal flow, then BottomSheet with marginTop 200 adds 200 margin from the header?
        // No, `View` children are flex column by default.
        // So Header takes space.
        // Then BottomSheet takes space + 200 margin?
        // Let's re-read the original css.
        // The original `header` zIndex: 1. `bottomSheet` marginTop: 200.
        // It seems the `marginTop: 200` was intended to push the sheet down from the top of the container, 
        // effectively making the header area 200px tall. 
        // BUT, if the Header component renders content, it takes up space.
        // In the original, `header` was just the text/back button. `pokeballDecoration` was absolute. 
        // The entire container is flex: 1.
        // The `marginTop: 200` on Bottomsheet likely pushes it down to leave room for the image/header background.
        // IF I put Header component and BottomSheet in a Column,...
        // PokemonHeader returns a View. 
        // That View contains SafeAreaView (Header content).
        // It consumes vertical space.
        // Then BottomSheet consumes remaining space.
        // If I keep `marginTop: 200`, it adds 200 spacing between Header and BottomSheet.
        // That might be too much if Header already takes space.
        // The original code:
        // Container -> [Header (normal flow), ShinyButton (absolute), Image (absolute), BottomSheet (marginTop: 200)]
        // So Header pushes BottomSheet down by its height? No, wait.
        // `marginTop` is margin. So yes.
        // But the 200 is likely "distance from top of screen" if Header was absolute? No, Header was not absolute.
        // So Header takes height H. BottomSheet starts at H + 200.
        // That seems large.
        // Ah, looking closely at original:
        // Header (SafeAreaView) has `zIndex: 1`. 
        // BottomSheet has `marginTop: 200`.
        // Image is `top: 130`, absolute.
        // It looks like the Header takes minimal space (just the text), and the 200 margin provides the "Hero" area.
        // So I should keep it similar.
        // However, I put the Image INSIDE PokemonHeader.
        // If PokemonHeader contains the absolute image, that's fine, it won't affect layout flow if it's absolute.
        // But if PokemonHeader is just the top part, I need to make sure the BottomSheet overlaps correctly or is positioned correctly.
        // The styling `marginTop: 200` is critical here.
        // Since I'm strictly replacing components, the structure becomes:
        // <View container>
        //    <PokemonHeader />
        //    <View bottomSheet style={{marginTop: 200}} ... />
        // </View>
        // If PokemonHeader takes up space (it does, it has SafeAreaView with text), then BottomSheet starts AFTER that space + 200.
        // Example: Header height 100. BottomSheet starts at 300.
        // Original: Same structure. Header was first child. 
        // So logic matches. I will keep `marginTop: 200`.
        marginTop: 200,
        paddingTop: 50,
        paddingHorizontal: metrics.marginHorizontal,
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
        marginTop: 10,
    },
    tab: {
        paddingBottom: 10,
        alignItems: 'center',
    },
    tabText: {
        color: colors.grey,
        fontWeight: 'bold',
    },
    activeTabText: {
        color: colors.text,
    },
    activeLine: {
        height: 2,
        backgroundColor: colors.primary,
        width: '100%',
        marginTop: 5,
    },
    contentArea: {
        flex: 1,
    }
});

export default PokemonDetailContent;
