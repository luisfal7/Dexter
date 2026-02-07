import { useState, useEffect, useCallback } from 'react';
import { getPokemonList, getPokemonDetails } from '../../../services/api';
import { Pokemon } from '../../../types';

// Interface for detailed Pokemon info needed for Top Tier
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

// Hook to manage Top Tier logic
// Español: Hook para manejar la lógica del Top Tier
export const useTopTierPokemon = () => {
    const [pokemonList, setPokemonList] = useState<TopTierPokemon[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

    const [loadingProgress, setLoadingProgress] = useState(0);

    const fetchTopTierData = useCallback(async () => {
        try {
            setIsLoading(true);
            setLoadingProgress(0);

            // Fetching all generations (~1300+ known pokemon/forms)
            // Español: Obteniendo todas las generaciones
            // Using 1500 to be safe
            const listData = await getPokemonList(1500, 0);

            const results: TopTierPokemon[] = [];
            const batchSize = 20;
            const items = listData.results;

            for (let i = 0; i < items.length; i += batchSize) {
                const batch = items.slice(i, i + batchSize);

                const batchPromises = batch.map(async (p: any) => {
                    try {
                        const details = await getPokemonDetails(p.url);
                        // Basic validation to ensure we have stats
                        if (!details || !details.stats) return null;

                        const totalStats = details.stats.reduce((acc: number, curr: any) => acc + curr.base_stat, 0);

                        return {
                            id: details.id,
                            name: p.name,
                            url: p.url,
                            stats: details.stats,
                            types: details.types,
                            sprites: details.sprites,
                            totalStats,
                        } as TopTierPokemon;
                    } catch (err) {
                        console.warn(`Failed to fetch details for ${p.name}`, err);
                        return null;
                    }
                });

                const batchResults = await Promise.all(batchPromises);
                const validResults = batchResults.filter((item): item is TopTierPokemon => item !== null);
                results.push(...validResults);

                // Update progress
                setLoadingProgress(Math.min(100, Math.round(((i + batchSize) / items.length) * 100)));
            }

            setPokemonList(results);
        } catch (error) {
            console.error('Error fetching Top Tier data', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTopTierData();
    }, [fetchTopTierData]);

    const toggleSortOrder = () => {
        setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    };

    const sortedList = [...pokemonList].sort((a, b) => {
        if (sortOrder === 'desc') {
            return b.totalStats - a.totalStats;
        } else {
            return a.totalStats - b.totalStats;
        }
    });

    return {
        pokemonList: sortedList,
        isLoading,
        loadingProgress,
        sortOrder,
        toggleSortOrder,
    };
};
