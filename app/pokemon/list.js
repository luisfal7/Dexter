import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { PokemonListView } from '../../src/features/pokemon/components';
import { getPokemonsByType, getGenerationDetails } from '../../src/services';
import { colors } from '../../src/theme';

const fetchPokemonList = async ({ type, generation }) => {
    let formatted = [];

    if (generation) {
        const data = await getGenerationDetails(generation);
        if (data && data.pokemon_species) {
            formatted = data.pokemon_species.map(p => {
                const urlParts = p.url.split('/');
                const id = urlParts[urlParts.length - 2];
                return {
                    name: p.name,
                    url: p.url,
                    id: parseInt(id),
                };
            });
            // Sort by ID for generations
            formatted.sort((a, b) => a.id - b.id);
        }
    } else {
        const searchType = type || 'grass';
        const data = await getPokemonsByType(searchType);

        if (data && data.pokemon) {
            formatted = data.pokemon.map(p => {
                const urlParts = p.pokemon.url.split('/');
                const id = urlParts[urlParts.length - 2];
                return {
                    name: p.pokemon.name,
                    url: p.pokemon.url,
                    id: parseInt(id),
                };
            });
        }
    }
    return formatted;
};

const PokemonListRoute = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { type, generation, title } = params;

    const { data: pokemons = [], isLoading: loading } = useQuery({
        queryKey: ['pokemonList', { type, generation }],
        queryFn: () => fetchPokemonList({ type, generation }),
    });

    const handleSelectPokemon = (item) => {
        router.push({
            pathname: `/pokemon/${item.id}`,
            params: {
                name: item.name,
                url: item.url,
                color: type ? (colors.types[type] || colors.primary) : colors.primary
            }
        });
    };

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <PokemonListView
                pokemons={pokemons}
                loading={loading}
                onSelectPokemon={handleSelectPokemon}
                onBack={() => router.back()}
                title={title}
                type={type}
                generation={generation}
            />
        </>
    );
};

export default PokemonListRoute;
