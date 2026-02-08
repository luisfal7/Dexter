import { useState, useMemo, useEffect } from 'react';
import { useTopTierStore } from '../store/useTopTierStore';
import { TopTierPokemon } from '../types';

// Hook to manage Top Tier logic
// Español: Hook para manejar la lógica del Top Tier
export const useTopTierPokemon = () => {
    const { pokemonList, isLoading, loadingProgress, fetchTopTierData, hasLoaded } = useTopTierStore();
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

    useEffect(() => {
        // Only fetch if not already loaded or loading
        // Español: Solo obtener si no está cargado o cargando
        if (!hasLoaded && !isLoading) {
            fetchTopTierData();
        }
    }, [hasLoaded, isLoading, fetchTopTierData]);

    const toggleSortOrder = () => {
        setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    };

    // Use memo to sort the list from the store without mutating it
    // Español: Usar memo para ordenar la lista del store sin mutarla
    const sortedList = useMemo(() => {
        return [...pokemonList].sort((a, b) => {
            if (sortOrder === 'desc') {
                return b.totalStats - a.totalStats;
            } else {
                return a.totalStats - b.totalStats;
            }
        });
    }, [pokemonList, sortOrder]);

    return {
        pokemonList: sortedList,
        isLoading,
        loadingProgress,
        sortOrder,
        toggleSortOrder,
    };
};
