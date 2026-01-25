import { useQuery } from '@tanstack/react-query';
import { getPokemonsByType, getGenerationDetails } from '../../../services';
import { PokemonAdapter } from '../adapters/pokemon.adapter';
import { Pokemon } from '../../../types';

interface UsePokemonListParams {
    type?: string;
    generation?: number | string;
}

export const usePokemonList = ({ type, generation }: UsePokemonListParams) => {

    // Internal function to coordinate fetching and adapting
    const fetchAndAdapt = async () => {
        let pokemons: Pokemon[] = [];

        if (generation) {
            const data = await getGenerationDetails(generation);
            if (data?.pokemon_species) {
                pokemons = data.pokemon_species.map(PokemonAdapter.fromGeneration);
                // Generations usually need sorting by ID
                pokemons = PokemonAdapter.sortById(pokemons);
            }
        } else {
            const searchType = type || 'grass'; // Default if neither provided
            const data = await getPokemonsByType(searchType);
            if (data?.pokemon) {
                pokemons = data.pokemon.map(PokemonAdapter.fromType);
            }
        }
        return pokemons;
    };

    const query = useQuery({
        queryKey: ['pokemonList', { type, generation }],
        queryFn: fetchAndAdapt,
    });

    return {
        pokemons: query.data || [],
        isLoading: query.isLoading,
        error: query.error,
        refetch: query.refetch,
    };
};
