import { Pokemon, PokemonGenerationItem, PokemonTypeItem } from '../types';

export { Pokemon }; // Re-export for convenience if needed, or consumers import from types

export const PokemonAdapter = {
    /**
     * Adapts a single item from the 'getGenerationDetails' response (pokemon_species array).
     * Español: Adapta un solo elemento de la respuesta 'getGenerationDetails'.
     * @param item Raw item from API
     */
    fromGeneration: (item: PokemonGenerationItem): Pokemon => {
        const urlParts = item.url.split('/');
        const id = parseInt(urlParts[urlParts.length - 2]);
        return {
            id,
            name: item.name,
            url: item.url,
        };
    },

    /**
     * Adapts a single item from the 'getPokemonsByType' response (pokemon array objects).
     * Structure is { pokemon: { name, url } }
     * Español: Adapta un ítem de la respuesta 'getPokemonsByType'. Estructura es { pokemon: { name, url } }
     * @param item Raw item from API
     */
    fromType: (item: PokemonTypeItem): Pokemon => {
        const { name, url } = item.pokemon;
        const urlParts = url.split('/');
        const id = parseInt(urlParts[urlParts.length - 2]);
        return {
            id,
            name,
            url,
        };
    },

    /**
     * Helper to sort Pokemons by ID
     * Español: Ayudante para ordenar Pokemones por ID
     */
    sortById: (pokemons: Pokemon[]): Pokemon[] => {
        return [...pokemons].sort((a, b) => a.id - b.id);
    }
};
