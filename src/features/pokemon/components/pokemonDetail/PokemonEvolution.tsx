import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../../theme';
import { usePokemonEvolution, EvolutionChainNode } from '../../hooks/usePokemonEvolution';

interface PokemonEvolutionProps {
    evolutionUrl: string;
    isShiny?: boolean;
    currentPokemonId: string | number;
}

const PokemonEvolution: React.FC<PokemonEvolutionProps> = ({ evolutionUrl, isShiny, currentPokemonId }) => {
    // Using the custom hook to handle logic
    // Español: Usando el hook personalizado para manejar la lógica
    const { evolutionChains, loading, formatTriggerString } = usePokemonEvolution(evolutionUrl);
    const router = useRouter();

    const handlePress = (pokemon: EvolutionChainNode) => {
        if (pokemon.id === String(currentPokemonId)) return;

        router.push({
            pathname: `/pokemon/${pokemon.id}`,
            params: {
                name: pokemon.name,
                url: pokemon.url,
                color: colors.primary
            }
        });
    };

    if (loading) {
        return <ActivityIndicator size="small" color={colors.primary} />;
    }

    // Standard: Hide component if no evolutions
    // Español: Estándar: Ocultar componente si no hay evoluciones
    // Check if any chain has more than 1 pokemon (base + evolution)
    const hasEvolutions = evolutionChains.some(chain => chain.length > 1);

    if (evolutionChains.length === 0 || !hasEvolutions) {
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
                                {/* Español: Renderizar flecha + detalles si no es el primer ítem */}
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
                                    disabled={stage.id === String(currentPokemonId)}
                                >
                                    <View style={[
                                        styles.imageBackground,
                                        stage.id === String(currentPokemonId) && styles.activePokemonBackground
                                    ]}>
                                        <Image
                                            source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${isShiny ? 'shiny/' : ''}${stage.id}.png` }}
                                            style={styles.image}
                                            contentFit="contain"
                                        />
                                    </View>
                                    <Text style={[
                                        styles.name,
                                        stage.id === String(currentPokemonId) && styles.activePokemonText
                                    ]} numberOfLines={1}>
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
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginBottom: 20,
        width: '100%',
    },
    pokemonContainer: {
        alignItems: 'center',
        width: 70,
    },
    imageBackground: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.lightGrey,
        borderRadius: 30,
    },
    activePokemonBackground: {
        borderWidth: 2,
        borderColor: colors.primary,
        backgroundColor: 'rgba(252, 108, 109, 0.1)', // Light primary color
    },
    image: {
        width: 50,
        height: 50,
    },
    name: {
        marginTop: 5,
        fontWeight: '500',
        color: colors.text,
        fontSize: 10,
        textAlign: 'center',
    },
    activePokemonText: {
        color: colors.primary,
        fontWeight: 'bold',
    },
    arrowContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        paddingHorizontal: 2,
    },
    detailsContainer: {
        alignItems: 'center',
        marginTop: 2,
    },
    levelText: {
        fontSize: 9,
        color: colors.grey,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 2,
        flexWrap: 'wrap',
    }
});

export default React.memo(PokemonEvolution);
