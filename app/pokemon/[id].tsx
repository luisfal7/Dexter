import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import PokemonDetailContent from '../../src/features/pokemon/components/pokemonDetail/PokemonDetailContent';

const PokemonDetailRoute = () => {
    const router = useRouter();
    const params = useLocalSearchParams();

    // params contains id, name, url, color
    // We need to reconstruct the pokemon object for the content component
    const pokemon = {
        id: params.id,
        name: params.name,
        url: params.url // might be undefined if deep linked only by ID, but Content handles fetching
    };

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <PokemonDetailContent
                pokemon={pokemon}
                color={params.color}
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
