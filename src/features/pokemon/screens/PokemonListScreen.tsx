import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { PokemonListView } from '../components';
import { getPokemonsByType, getGenerationDetails } from '../../../services';
import { colors } from '../../../theme';

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

const PokemonListScreen = ({ navigation, route }) => {
    const { type, generation, title } = route.params || {};

    const { data: pokemons = [], isLoading: loading } = useQuery({
        queryKey: ['pokemonList', { type, generation }],
        queryFn: () => fetchPokemonList({ type, generation }),
    });

    const handleSelectPokemon = (item) => {
        navigation.navigate('PokemonDetail', {
            pokemon: item,
            color: type ? (colors.types[type] || colors.primary) : colors.primary
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
