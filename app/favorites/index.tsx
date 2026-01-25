import React from 'react';
import { useRouter, Stack } from 'expo-router';
import { usePokemonStore } from '../../src/store/usePokemonStore';
import { FavoritesView } from '../../src/features/pokemon/components';
import { colors } from '../../src/theme';

const FavoritesRoute = () => {
    const router = useRouter();
    const { favorites } = usePokemonStore();

    const handleSelectPokemon = (item: { id: number; name: string; url: string }) => {
        router.push({
            pathname: `/pokemon/${item.id}`,
            params: {
                name: item.name,
                url: item.url,
                color: colors.primary
            }
        });
    };

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <FavoritesView
                favorites={favorites}
                onSelectPokemon={handleSelectPokemon}
                onBack={() => router.back()}
            />
        </>
    );
};

export default FavoritesRoute;
