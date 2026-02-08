import { create } from 'zustand';
import { getPokemonList, getPokemonDetails } from '../../../services/api';
import { TopTierPokemon } from '../types';

interface TopTierState {
    pokemonList: TopTierPokemon[];
    isLoading: boolean;
    loadingProgress: number;
    hasLoaded: boolean;
    fetchTopTierData: () => Promise<void>;
}

// English: Store to manage Top Tier data and avoid re-fetching
// Español: Store para manejar los datos del Top Tier y evitar volver a obtenerlos
export const useTopTierStore = create<TopTierState>((set, get) => ({
    pokemonList: [],
    isLoading: false,
    loadingProgress: 0,
    hasLoaded: false,

    fetchTopTierData: async () => {
        // English: If data is already loaded, don't fetch again
        // Español: Si los datos ya están cargados, no volver a obtenerlos
        if (get().hasLoaded || get().isLoading) return;

        set({ isLoading: true, loadingProgress: 0 });

        try {
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
                set({ loadingProgress: Math.min(100, Math.round(((i + batchSize) / items.length) * 100)) });
            }

            // English: Sort initially by total stats descending
            // Español: Ordenar inicialmente por estadísticas totales descendentes
            results.sort((a, b) => b.totalStats - a.totalStats);

            set({ pokemonList: results, hasLoaded: true });
        } catch (error) {
            console.error('Error fetching Top Tier data', error);
        } finally {
            set({ isLoading: false });
        }
    },
}));
