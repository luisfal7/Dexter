import { useQuery } from '@tanstack/react-query';
import { getPokemonsByType, getGenerationDetails } from '../../../services';
import { PokemonAdapter } from '../adapters/pokemon.adapter';
import { Pokemon } from '../../../types';

interface UsePokemonListParams {
    type?: string;
    generation?: number | string;
}

export const usePokemonList = ({ type, generation }: UsePokemonListParams) => {

    // English: Internal function to coordinate fetching and adapting
    // Español: Función interna para coordinar la obtención y adaptación
    const fetchAndAdapt = async () => {
        let pokemons: Pokemon[] = [];

        if (generation) {
            const data = await getGenerationDetails(generation);
            if (data?.pokemon_species) {
                pokemons = data.pokemon_species.map(PokemonAdapter.fromGeneration);
                // English: Generations usually need sorting by ID
                // Español: Las generaciones usualmente necesitan ordenarse por ID
                pokemons = PokemonAdapter.sortById(pokemons);
            }
        } else {
            const searchType = type || 'grass'; // English: Default if neither provided | Español: Por defecto si ninguno se provee
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
