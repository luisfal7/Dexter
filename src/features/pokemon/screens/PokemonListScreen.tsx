import React from 'react';
import { PokemonListView } from '../components';
import { colors } from '../../../theme';
import { usePokemonList } from '../hooks/usePokemonList';
import { Pokemon } from '../../../types';

// Basic types for navigation/route. 
// In a full strict app, these would come from a global navigation type definition file.
import { useRouter, useLocalSearchParams } from 'expo-router';

// ... imports

const PokemonListScreen: React.FC = () => {
    const router = useRouter();
    const params = useLocalSearchParams();

    // Normalize params
    const type = Array.isArray(params.type) ? params.type[0] : params.type;
    const generation = Array.isArray(params.generation) ? params.generation[0] : params.generation;
    const title = Array.isArray(params.title) ? params.title[0] : params.title;

    // Facade Pattern: Component doesn't know about axios or react-query implementation details
    const { pokemons, isLoading: loading } = usePokemonList({ type, generation });

    const handleSelectPokemon = (item: Pokemon) => {
        const typeKey = type as keyof typeof colors.types;
        const color = (type && typeKey && colors.types[typeKey]) ? colors.types[typeKey] : colors.primary;

        router.push({
            pathname: `/pokemon/${item.id}`,
            params: {
                name: item.name,
                url: item.url,
                color: color
            }
        });
    };

    return (
        <PokemonListView
            pokemons={pokemons}
            loading={loading}
            onSelectPokemon={handleSelectPokemon}
            onBack={() => router.back()}
            title={title}
            type={type}
            generation={generation}
        />
    );
};

export default PokemonListScreen;
