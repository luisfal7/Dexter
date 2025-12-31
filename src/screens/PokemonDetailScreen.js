import React from 'react';
import { View, StyleSheet } from 'react-native';
import PokemonDetailContent from '../components/PokemonDetailContent';

const PokemonDetailScreen = ({ navigation, route }) => {
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
