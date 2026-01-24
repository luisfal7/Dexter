import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors, metrics } from '../../../../theme';
import PokemonHeader from './PokemonHeader';
import PokemonAbout from './PokemonAbout';
import PokemonStats from './PokemonStats';
import PokemonMoves from './PokemonMoves';
import PokemonEvolution from './PokemonEvolution';
import PokemonTypeMatchups from './PokemonTypeMatchups';

const PokemonDetailView = ({
    pokemon,
    details,
    species,
    onBackPressed,
    isFavorite,
    onToggleFavorite
}) => {
    const [activeTab, setActiveTab] = useState('About');
    const [backgroundColor, setBackgroundColor] = useState(colors.primary); // Default
    const [isShiny, setIsShiny] = useState(false);

    // but typically View is dumb. Let's assume onToggleFavorite is passed and isFavorite prop.
    // Or we stick to Container handling it.
    // Let's modify props to accept isFavorite and onToggleFavorite


    // Update background color based on type when details load
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
                isFavorite={isFavorite}
                onToggleFavorite={onToggleFavorite}
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

export default PokemonDetailView;
