import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, metrics } from '../../../../theme';

const { width } = Dimensions.get('window');

interface PokemonHeaderProps {
    pokemon: {
        id: number;
        name: string;
    };
    details?: {
        types: { type: { name: string } }[];
    };
    backgroundColor?: string;
    isShiny: boolean;
    setIsShiny: (value: boolean) => void;
    onBackPressed: () => void;
    isFavorite: boolean;
    onToggleFavorite: () => void;
}

const PokemonHeader: React.FC<PokemonHeaderProps> = ({ pokemon, details, backgroundColor, isShiny, setIsShiny, onBackPressed, isFavorite, onToggleFavorite }) => {
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${isShiny ? 'shiny/' : ''}${pokemon.id}.png`;
    const formattedId = `#${pokemon.id.toString().padStart(3, '0')}`;

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.header}>
                <View style={styles.topNav}>
                    <TouchableOpacity onPress={onBackPressed}>
                        <Ionicons name="arrow-back" size={28} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={onToggleFavorite}>
                        <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={28} color="white" />
                    </TouchableOpacity>
                </View>
                <View style={styles.headerContent}>
                    <View>
                        <Text style={styles.name}>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</Text>
                        <View style={styles.badges}>
                            {details && details.types?.map(t => (
                                <View key={t.type.name} style={styles.badge}>
                                    <Text style={styles.badgeText}>{t.type.name}</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                    <Text style={styles.idText}>{formattedId}</Text>
                </View>
                <View style={styles.pokeballDecoration} />
            </SafeAreaView>

            {/* Shiny Toggle Button */}
            <TouchableOpacity
                style={styles.shinyButton}
                onPress={() => setIsShiny(!isShiny)}
                activeOpacity={0.7}
            >
                <Ionicons name={isShiny ? "sunny" : "sunny-outline"} size={20} color={isShiny ? "#FFD700" : "white"} />
            </TouchableOpacity>

            {/* Floating Image */}
            <View style={styles.imageContainer}>
                <Image source={{ uri: imageUrl }} style={styles.image} contentFit="contain" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        zIndex: 1,
    },
    header: {
        paddingHorizontal: metrics.marginHorizontal,
    },
    topNav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
    },
    name: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 5,
    },
    badges: {
        flexDirection: 'row',
    },
    badge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 15,
        paddingHorizontal: 12,
        paddingVertical: 5,
        marginRight: 5,
    },
    badgeText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 12,
    },
    idText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    pokeballDecoration: {
        position: 'absolute',
        top: 150,
        right: -20,
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(255,255,255,0.1)',
        zIndex: -1,
    },
    imageContainer: {
        position: 'absolute',
        top: 130, // Adjusted relative to where it was
        alignSelf: 'center',
        zIndex: 2,
    },
    image: {
        width: 250,
        height: 250,
    },
    shinyButton: {
        position: 'absolute',
        top: 300,
        right: metrics.marginHorizontal,
        zIndex: 10,
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: 5,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default PokemonHeader;
