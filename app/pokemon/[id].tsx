import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import PokemonDetailContent from '../../src/features/pokemon/components/pokemonDetail/PokemonDetailContent';

const PokemonDetailRoute = () => {
    const router = useRouter();
    const params = useLocalSearchParams();

    // params contains id, name, url, color
    // We need to reconstruct the pokemon object for the content component
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const name = Array.isArray(params.name) ? params.name[0] : params.name;
    const url = Array.isArray(params.url) ? params.url[0] : params.url;
    const color = Array.isArray(params.color) ? params.color[0] : params.color;

    const pokemon = {
        id: parseInt(id || '0'),
        name: name || '',
        url: url || ''
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <PokemonDetailContent
                pokemon={pokemon}
                color={color}
                onBackPressed={() => router.back()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default PokemonDetailRoute;
