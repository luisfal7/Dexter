import React from 'react';
import { View, StyleSheet } from 'react-native';
import PokemonDetailContent from '../components/pokemonDetail/PokemonDetailContent';

interface PokemonDetailScreenProps {
    navigation: any; // Using explicit any for navigation for now as full typing is complex without navigation types file
    route: {
        params: {
            pokemon: any;
            color: string;
        }
    }
}

const PokemonDetailScreen: React.FC<PokemonDetailScreenProps> = ({ navigation, route }) => {
    const { pokemon, color } = route.params;

    return (
        <View style={styles.container}>
            <PokemonDetailContent
                pokemon={pokemon}
                color={color}
                onBackPressed={() => navigation.goBack()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default PokemonDetailScreen;
