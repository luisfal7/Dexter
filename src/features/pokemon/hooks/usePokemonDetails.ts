import { useQuery } from '@tanstack/react-query';
import { getPokemonDetails, getPokemonSpecies } from '../../../services';
import { usePokemonStore } from '../../../store/usePokemonStore';
import { Pokemon, PokemonDetails, PokemonSpecies } from '../types';

// English: Interface for the hook return value
// Español: Interfaz para el valor de retorno del hook
interface UsePokemonDetailsReturn {
    details: PokemonDetails | undefined;
    species: PokemonSpecies | undefined;
    loadingDetails: boolean;
    loadingSpecies: boolean;
    isFavorite: boolean;
    toggleFavorite: () => void;
}

// English: Custom hook to manage Pokemon details logic
// Español: Hook personalizado para manejar la lógica de detalles de Pokémon
export const usePokemonDetails = (pokemon: Pokemon): UsePokemonDetailsReturn => {
    const { isFavorite: checkFavorite, toggleFavorite: toggleStoreFavorite } = usePokemonStore();
    const isFavorite = checkFavorite(pokemon.id);

    // English: Determine the correct URL for fetching details
    // Español: Determinar la URL correcta para obtener detalles
    let detailUrl = pokemon.url;
    if (pokemon.id) {
        detailUrl = `https://pokeapi.co/api/v2/pokemon/${pokemon.id}`;
    } else if (pokemon.url && pokemon.url.includes('pokemon-species')) {
        const parts = pokemon.url.split('/');
        const id = parts[parts.length - 2];
        detailUrl = `https://pokeapi.co/api/v2/pokemon/${id}`;
    }

    // English: Fetch Pokemon details
    // Español: Obtener detalles del Pokémon
    const { data: details, isLoading: loadingDetails } = useQuery<PokemonDetails>({
        queryKey: ['pokemonDetails', detailUrl],
        queryFn: () => getPokemonDetails(detailUrl),
        enabled: !!detailUrl,
    });

    // English: Fetch Pokemon species data
    // Español: Obtener datos de la especie del Pokémon
    const { data: species, isLoading: loadingSpecies } = useQuery<PokemonSpecies>({
        queryKey: ['pokemonSpecies', details?.id],
        queryFn: () => getPokemonSpecies((pokemon.id || details?.id)!),
        enabled: !!details?.id || !!pokemon.id,
    });

    // English: Wrapper for toggle favorite to handle missing ID potentially
    // Español: Envoltorio para alternar favorito para manejar ID faltante potencialmente
    const toggleFavorite = () => {
        if (!details && !pokemon.id) return; // Guard clause

        toggleStoreFavorite({
            id: details?.id || pokemon.id,
            name: pokemon.name,
            url: pokemon.url
        });
    };

    return {
        details,
        species,
        loadingDetails,
        loadingSpecies,
        isFavorite,
        toggleFavorite
    };
};
