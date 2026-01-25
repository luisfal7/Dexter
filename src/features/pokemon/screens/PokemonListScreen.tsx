import React from 'react';
import { PokemonListView } from '../components';
import { colors } from '../../../theme';
import { usePokemonList } from '../hooks/usePokemonList';
import { Pokemon } from '../../../types';

// Basic types for navigation/route. 
// In a full strict app, these would come from a global navigation type definition file.
interface RouteParams {
    type?: string;
    generation?: number | string;
    title?: string;
}

interface PokemonListScreenProps {
    navigation: {
        navigate: (screen: string, params: any) => void;
        goBack: () => void;
    };
    route: {
        params?: RouteParams;
    };
}

const PokemonListScreen: React.FC<PokemonListScreenProps> = ({ navigation, route }) => {
    const { type, generation, title } = route.params || {};

    // Facade Pattern: Component doesn't know about axios or react-query implementation details
    const { pokemons, isLoading: loading } = usePokemonList({ type, generation });

    const handleSelectPokemon = (item: Pokemon) => {
        const typeKey = type as keyof typeof colors.types;
        navigation.navigate('PokemonDetail', {
            pokemon: item,
            color: type && colors.types[typeKey] ? colors.types[typeKey] : colors.primary
        });
    };

    return (
        <PokemonListView
            pokemons={pokemons}
            loading={loading}
            onSelectPokemon={handleSelectPokemon}
            onBack={() => navigation.goBack()}
            title={title}
            type={type}
            generation={generation}
        />
    );
};

export default PokemonListScreen;
