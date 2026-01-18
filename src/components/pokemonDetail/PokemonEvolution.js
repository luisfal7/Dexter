
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { getEvolutionChain } from '../../services/api';

const PokemonEvolution = ({ evolutionUrl, isShiny, currentPokemonId }) => {
    const [evolutionStages, setEvolutionStages] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchEvolution = async () => {
            if (!evolutionUrl) return;
            try {
                const data = await getEvolutionChain(evolutionUrl);
                const stages = [];
                let current = data.chain;

                // Push first stage
                if (current) {
                    const species = current.species;
                    const id = species.url.split('/')[6];
                    stages.push({
                        name: species.name,
                        id: id,
                        url: species.url,
                        evolutionDetails: null
                    });
                }

                // Traverse chain
                while (current && current.evolves_to && current.evolves_to.length > 0) {
                    // Handle branching: currently just taking first path
                    const nextEvolution = current.evolves_to[0];
                    const species = nextEvolution.species;
                    const id = species.url.split('/')[6];
                    const details = nextEvolution.evolution_details[0];

                    stages.push({
                        name: species.name,
                        id: id,
                        url: species.url,
                        evolutionDetails: details
                    });

                    current = nextEvolution;
                }
                setEvolutionStages(stages);
            } catch (error) {
                console.error("Failed to load evolution chain", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvolution();
    }, [evolutionUrl]);

    const handlePress = (pokemon) => {
        if (pokemon.id === String(currentPokemonId)) return;

        navigation.push('PokemonDetail', {
            pokemon: {
                name: pokemon.name,
                url: pokemon.url,
                id: pokemon.id
            },
            color: colors.primary
        });
    };

    if (loading) {
        return <ActivityIndicator size="small" color={colors.primary} />;
    }

    if (evolutionStages.length <= 1) {
        return null;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Evolution Chain</Text>
            <View style={styles.evolutionRow}>
                {evolutionStages.map((stage, index) => (
                    <React.Fragment key={index}>
                        {/* Render arrow if not the first item */}
                        {index > 0 && (
                            <View style={styles.arrowContainer}>
                                <Ionicons name="arrow-forward" size={20} color={colors.grey} />
                                {stage.evolutionDetails?.min_level && (
                                    <Text style={styles.levelText}>{`Lvl ${stage.evolutionDetails.min_level}`}</Text>
                                )}
                            </View>
                        )}

                        <TouchableOpacity
                            style={styles.pokemonContainer}
                            onPress={() => handlePress(stage)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.imageBackground}>
                                <Image
                                    source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${isShiny ? 'shiny/' : ''}${stage.id}.png` }}
                                    style={styles.image}
                                />
                            </View>
                            <Text style={styles.name} numberOfLines={1}>{stage.name.charAt(0).toUpperCase() + stage.name.slice(1)}</Text>
                        </TouchableOpacity>
                    </React.Fragment>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 15,
        marginLeft: 10, // Align title with content padding if needed
    },
    evolutionRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 10,
    },
    pokemonContainer: {
        alignItems: 'center',
        // Removed fixed margins to let space-evenly handle spacing
        maxWidth: 100, // unexpected long names safety
    },
    imageBackground: {
        width: 75,
        height: 75,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 65,
        height: 65,
    },
    name: {
        marginTop: 5,
        fontWeight: 'bold',
        color: colors.text,
        fontSize: 12,
        textAlign: 'center',
    },
    arrowContainer: {
        alignItems: 'center',
        marginHorizontal: 2,
    },
    levelText: {
        fontSize: 10,
        color: colors.grey,
        fontWeight: 'bold',
        marginTop: 2,
    }
});

export default PokemonEvolution;
