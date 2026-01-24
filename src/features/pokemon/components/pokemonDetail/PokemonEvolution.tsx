
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../../theme';
import { getEvolutionChain } from '../../../../services';
// ... imports

interface PokemonEvolutionProps {
    evolutionUrl: string;
    isShiny?: boolean;
    currentPokemonId: string | number;
}

interface EvolutionChainNode {
    id: string;
    name: string;
    evolutionDetails: any[];
    url: string;
}

const PokemonEvolution: React.FC<PokemonEvolutionProps> = ({ evolutionUrl, isShiny, currentPokemonId }) => {
    const [evolutionChains, setEvolutionChains] = useState<EvolutionChainNode[][]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();

    useEffect(() => {
        const fetchEvolution = async () => {
            try {
                if (!evolutionUrl) {
                    setLoading(false);
                    return;
                }
                const data = await getEvolutionChain(evolutionUrl);

                const chains: EvolutionChainNode[][] = [];
                let evolutionData = data.chain;

                // Helper to process chain recursively (not currently used but kept for ref)
                // const processChain = (startNode: any): EvolutionChainNode[] => { ... }

                // Let's use a queue standard BFS/DFS or just simpler recursion to build "lanes"
                const buildPaths = (node: any, currentPath: EvolutionChainNode[]) => {
                    const id = node.species.url.split('/')[6];
                    const pokemon: EvolutionChainNode = {
                        id: id,
                        name: node.species.name,
                        evolutionDetails: node.evolution_details,
                        url: node.species.url
                    };

                    const newPath = [...currentPath, pokemon];

                    if (node.evolves_to.length === 0) {
                        chains.push(newPath);
                    } else {
                        node.evolves_to.forEach((child: any) => buildPaths(child, newPath));
                    }
                };

                buildPaths(evolutionData, []);
                setEvolutionChains(chains);

            } catch (error) {
                console.error("Failed to load evolution:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvolution();
    }, [evolutionUrl]);

    const handlePress = (pokemon: EvolutionChainNode) => {
        if (pokemon.id === String(currentPokemonId)) return;

        router.push({
            pathname: '/pokemon/[id]',
            params: {
                id: pokemon.id,
                name: pokemon.name,
                url: pokemon.url,
                color: colors.primary
            }
        });
    };

    const formatTriggerString = (detail: any) => {
        const triggers = [];

        // Level Up
        if (detail.min_level) triggers.push(`Lvl ${detail.min_level}`);

        // Item Use
        if (detail.item) triggers.push(`Use ${detail.item.name.replace(/-/g, ' ')}`);

        // Trade
        if (detail.trigger.name === 'trade') triggers.push('Trade');

        // Happiness / Affinity
        if (detail.min_happiness) triggers.push(`Happiness ${detail.min_happiness}`);
        if (detail.min_affection) triggers.push(`Affection ${detail.min_affection}`);
        if (detail.min_beauty) triggers.push(`Beauty ${detail.min_beauty}`);

        // Held Item
        if (detail.held_item) triggers.push(`Hold ${detail.held_item.name.replace(/-/g, ' ')}`);

        // Known Move logic
        if (detail.known_move) triggers.push(`Knows ${detail.known_move.name.replace(/-/g, ' ')}`);
        if (detail.known_move_type) triggers.push(`Knows ${detail.known_move_type.name} type move`);

        // Location / Time / Weather
        if (detail.location) triggers.push(`In ${detail.location.name.replace(/-/g, ' ')}`);
        if (detail.time_of_day) triggers.push(detail.time_of_day);
        if (detail.needs_overworld_rain) triggers.push('In Rain');

        // Stats / Party / Gender
        if (detail.relative_physical_stats === 1) triggers.push('Atk > Def');
        if (detail.relative_physical_stats === -1) triggers.push('Def > Atk');
        if (detail.relative_physical_stats === 0) triggers.push('Atk = Def');

        if (detail.gender === 1) triggers.push('Female');
        if (detail.gender === 2) triggers.push('Male');

        if (detail.party_species) triggers.push(`With ${detail.party_species.name.replace(/-/g, ' ')}`);
        if (detail.party_type) triggers.push(`With ${detail.party_type.name} type`);

        if (detail.trade_species) triggers.push(`For ${detail.trade_species.name.replace(/-/g, ' ')}`);
        if (detail.turn_upside_down) triggers.push('Turn upside down');

        // Fallback for general trigger name if nothing else specific matched, but ignore simple 'level-up' if level was missing (e.g. happiness)
        // If we have triggers, join them. If empty, check generic trigger name.
        if (triggers.length === 0 && detail.trigger) {
            const name = detail.trigger.name.replace(/-/g, ' ');
            if (name !== 'level up') { // 'level up' without min_level usually implies happiness or other condition we should have caught
                triggers.push(name);
            }
        }

        return triggers.join(', ');
    };

    if (loading) {
        return <ActivityIndicator size="small" color={colors.primary} />;
    }

    if (evolutionChains.length === 0) {
        return null;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Evolution Chain</Text>
            <View style={styles.columnContainer}>
                {evolutionChains.map((chain, chainIndex) => (
                    <View key={`chain-${chainIndex}`} style={styles.evolutionRow}>
                        {chain.map((stage, index) => (
                            <React.Fragment key={`${chainIndex}-${stage.id}`}>
                                {/* Render arrow + details if not the first item */}
                                {index > 0 && (
                                    <View style={styles.arrowContainer}>
                                        <Ionicons name="arrow-forward" size={16} color={colors.grey} />
                                        <View style={styles.detailsContainer}>
                                            {stage.evolutionDetails && stage.evolutionDetails.map((detail, dIndex) => (
                                                <Text key={dIndex} style={styles.levelText} numberOfLines={2}>
                                                    {formatTriggerString(detail)}
                                                </Text>
                                            ))}
                                        </View>
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
                                            contentFit="contain"
                                        />
                                    </View>
                                    <Text style={styles.name} numberOfLines={1}>
                                        {stage.name.charAt(0).toUpperCase() + stage.name.slice(1)}
                                    </Text>
                                </TouchableOpacity>
                            </React.Fragment>
                        ))}
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        marginBottom: 20,
        width: '100%',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 15,
        marginLeft: 10,
    },
    columnContainer: {
        flexDirection: 'column',
        width: '100%',
    },
    evolutionRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly', // Changed to space-evenly to distribute available space
        alignItems: 'center',
        marginBottom: 20,
        width: '100%',
    },
    pokemonContainer: {
        alignItems: 'center',
        width: 70, // Reduced from 80
    },
    imageBackground: {
        width: 60, // Reduced from 70
        height: 60, // Reduced from 70
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.lightGrey,
        borderRadius: 30,
    },
    image: {
        width: 50, // Reduced from 60
        height: 50, // Reduced from 60
    },
    name: {
        marginTop: 5,
        fontWeight: '500',
        color: colors.text,
        fontSize: 10, // Reduced from 12
        textAlign: 'center',
    },
    arrowContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1, // Allow it to flex to fill space
        paddingHorizontal: 2,
    },
    detailsContainer: {
        alignItems: 'center',
        marginTop: 2,
    },
    levelText: {
        fontSize: 9, // Reduced from 10
        color: colors.grey,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 2,
        flexWrap: 'wrap',
    }
});

export default PokemonEvolution;
