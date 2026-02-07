// English: Shared types for Pokemon feature
// Español: Tipos compartidos para la funcionalidad de Pokémon

export interface Pokemon {
    id: number;
    name: string;
    url: string;
}

export interface PokemonType {
    slot: number;
    type: {
        name: string;
        url: string;
    };
}

export interface PokemonStat {
    base_stat: number;
    effort: number;
    stat: {
        name: string;
        url: string;
    };
}

export interface PokemonMove {
    move: {
        name: string;
        url: string;
    };
    version_group_details: {
        level_learned_at: number;
        move_learn_method: {
            name: string;
            url: string;
        };
        version_group: {
            name: string;
            url: string;
        };
    }[];
}

export interface PokemonDetails {
    id: number;
    name: string;
    height: number;
    weight: number;
    types: PokemonType[];
    stats: PokemonStat[];
    moves: PokemonMove[];
    sprites: {
        front_default: string;
        other: {
            'official-artwork': {
                front_default: string;
            };
        };
    };
}

export interface FlavorTextEntry {
    flavor_text: string;
    language: {
        name: string;
        url: string;
    };
    version: {
        name: string;
        url: string;
    };
}

export interface PokemonSpecies {
    id: number;
    name: string;
    flavor_text_entries: FlavorTextEntry[];
    evolution_chain: {
        url: string;
    };
}

// English: API Response Types
// Español: Tipos de respuesta de API

export interface PokemonGenerationItem {
    name: string;
    url: string;
}

export interface PokemonTypeItem {
    pokemon: {
        name: string;
        url: string;
    };
    slot: number;
}

export interface EvolutionDetail {
    min_level?: number;
    item?: { name: string };
    trigger: { name: string };
    min_happiness?: number;
    min_affection?: number;
    min_beauty?: number;
    held_item?: { name: string };
    known_move?: { name: string };
    known_move_type?: { name: string };
    location?: { name: string };
    time_of_day?: string;
    needs_overworld_rain?: boolean;
    relative_physical_stats?: number;
    gender?: number;
    party_species?: { name: string };
    party_type?: { name: string };
    trade_species?: { name: string };
    turn_upside_down?: boolean;
}

export interface EvolutionChainNodeRaw {
    species: {
        name: string;
        url: string;
    };
    evolution_details: EvolutionDetail[];
    evolves_to: EvolutionChainNodeRaw[];
    is_baby: boolean;
}

export interface EvolutionChainResponse {
    chain: EvolutionChainNodeRaw;
    id: number;
}
