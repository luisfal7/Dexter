import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { usePokemonStore } from '../../../../store/usePokemonStore';
import { getPokemonDetails, getPokemonSpecies } from '../../../../services';
import PokemonDetailView from './PokemonDetailView';

const PokemonDetailContent = ({ pokemon, color, onBackPressed }) => {

    const { isFavorite, toggleFavorite } = usePokemonStore();
    const isFav = isFavorite(pokemon.id);

    // Determine URL
    let detailUrl = pokemon.url;
    if (pokemon.id) {
        detailUrl = `https://pokeapi.co/api/v2/pokemon/${pokemon.id}`;
    } else if (pokemon.url && pokemon.url.includes('pokemon-species')) {
        const parts = pokemon.url.split('/');
        const id = parts[parts.length - 2];
        detailUrl = `https://pokeapi.co/api/v2/pokemon/${id}`;
    }

    const { data: details, isLoading: loadingDetails } = useQuery({
        queryKey: ['pokemonDetails', detailUrl],
        queryFn: () => getPokemonDetails(detailUrl),
        enabled: !!detailUrl,
    });

    const { data: species, isLoading: loadingSpecies } = useQuery({
        queryKey: ['pokemonSpecies', details?.id],
        queryFn: () => getPokemonSpecies(pokemon.id || details?.id),
        enabled: !!details?.id || !!pokemon.id,
    });

    return (
        <PokemonDetailView
            pokemon={pokemon}
            details={details}
            species={species}
            onBackPressed={onBackPressed}
            isFavorite={isFav}
            onToggleFavorite={() => toggleFavorite({
                ...pokemon,
                id: details?.id || pokemon.id // Ensure we have ID
            })}
        />
    );
};

export default PokemonDetailContent;
