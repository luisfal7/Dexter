import { MaterialCommunityIcons } from '@expo/vector-icons';

// Mapping based on the visual style of Pokemon types from PokemonTypeMatchups
// Español: Mapeo basado en el estilo visual de los tipos de Pokemon de PokemonTypeMatchups
export const POKEMON_TYPE_ICONS: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
    fire: 'fire',
    water: 'water',
    electric: 'flash',
    grass: 'leaf',
    ice: 'snowflake',
    fighting: 'boxing-glove',
    poison: 'skull',
    ground: 'terrain',
    flying: 'feather',
    psychic: 'eye-outline', // 'debian' was weird, using eye-outline or similar if available, keeping debian if preferred but 'eye' is standard psychic
    bug: 'ladybug',
    rock: 'cube',
    ghost: 'ghost',
    dragon: 'snake', // or 'fire' but snake fits dragon
    steel: 'nut',
    fairy: 'star-four-points',
    normal: 'circle-outline',
    dark: 'moon-waning-crescent',
};

// Fallback for types not listed
export const DEFAULT_TYPE_ICON = 'help';
