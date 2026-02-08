import { Pokemon } from '../../types';

// English: Interface for detailed Pokemon info needed for Top Tier
// Español: Interfaz para información detallada del Pokemon necesaria para el Top Tier
export interface TopTierPokemon extends Pokemon {
    stats: {
        base_stat: number;
        stat: {
            name: string;
        };
    }[];
    totalStats: number;
    types: {
        type: {
            name: string;
        };
    }[];
    sprites: {
        other: {
            'official-artwork': {
                front_default: string;
            };
        };
    };
}
