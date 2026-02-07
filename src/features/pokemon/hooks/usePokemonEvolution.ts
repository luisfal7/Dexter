import { useState, useEffect } from 'react';
import { getEvolutionChain } from '../../../services';
import { EvolutionChainNodeRaw, EvolutionDetail } from '../types';

// Proper typing for EvolutionChainNode
// Español: Tipado adecuado para EvolutionChainNode
export interface EvolutionChainNode {
    id: string;
    name: string;
    evolutionDetails: EvolutionDetail[];
    url: string;
}

// Hook to manage Pokemon evolution logic
// Español: Hook para manejar la lógica de evolución de Pokemon
export const usePokemonEvolution = (evolutionUrl: string) => {
    const [evolutionChains, setEvolutionChains] = useState<EvolutionChainNode[][]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchEvolution = async () => {
            try {
                if (!evolutionUrl) {
                    setLoading(false);
                    return;
                }
                const data = await getEvolutionChain(evolutionUrl);

                const chains: EvolutionChainNode[][] = [];
                let evolutionData: EvolutionChainNodeRaw = data.chain;

                // Helper to explore the evolution tree
                // Español: Auxiliar para explorar el árbol de evoluciones
                const buildPaths = (node: EvolutionChainNodeRaw, currentPath: EvolutionChainNode[]) => {
                    const id = node.species.url.split('/')[6];
                    const pokemon: EvolutionChainNode = {
                        id: id,
                        name: node.species.name,
                        evolutionDetails: node.evolution_details,
                        url: node.species.url
                    };

                    const newPath = [...currentPath, pokemon];

                    if (node.evolves_to.length === 0) {
                        chains.push(newPath);
                    } else {
                        node.evolves_to.forEach((child) => buildPaths(child, newPath));
                    }
                };

                buildPaths(evolutionData, []);
                setEvolutionChains(chains);

            } catch (error) {
                console.error("Failed to load evolution:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvolution();
    }, [evolutionUrl]);

    // Format trigger string logic moved here
    // Español: Lógica de formato de string de gatillo movida aquí
    const formatTriggerString = (detail: EvolutionDetail) => {
        const triggers: string[] = [];

        // Level Up
        if (detail.min_level) triggers.push(`Lvl ${detail.min_level}`);

        // Item Use
        if (detail.item) triggers.push(`Use ${detail.item.name.replace(/-/g, ' ')}`);

        // Trade
        if (detail.trigger.name === 'trade') triggers.push('Trade');

        // Happiness / Affinity
        if (detail.min_happiness) triggers.push(`Happiness ${detail.min_happiness}`);
        if (detail.min_affection) triggers.push(`Affection ${detail.min_affection}`);
        if (detail.min_beauty) triggers.push(`Beauty ${detail.min_beauty}`);

        // Held Item
        if (detail.held_item) triggers.push(`Hold ${detail.held_item.name.replace(/-/g, ' ')}`);

        // Known Move logic
        if (detail.known_move) triggers.push(`Knows ${detail.known_move.name.replace(/-/g, ' ')}`);
        if (detail.known_move_type) triggers.push(`Knows ${detail.known_move_type.name} type move`);

        // Location / Time / Weather
        if (detail.location) triggers.push(`In ${detail.location.name.replace(/-/g, ' ')}`);
        if (detail.time_of_day) triggers.push(detail.time_of_day);
        if (detail.needs_overworld_rain) triggers.push('In Rain');

        // Stats / Party / Gender
        if (detail.relative_physical_stats === 1) triggers.push('Atk > Def');
        if (detail.relative_physical_stats === -1) triggers.push('Def > Atk');
        if (detail.relative_physical_stats === 0) triggers.push('Atk = Def');

        if (detail.gender === 1) triggers.push('Female');
        if (detail.gender === 2) triggers.push('Male');

        if (detail.party_species) triggers.push(`With ${detail.party_species.name.replace(/-/g, ' ')}`);
        if (detail.party_type) triggers.push(`With ${detail.party_type.name} type`);

        if (detail.trade_species) triggers.push(`For ${detail.trade_species.name.replace(/-/g, ' ')}`);
        if (detail.turn_upside_down) triggers.push('Turn upside down');

        if (triggers.length === 0 && detail.trigger) {
            const name = detail.trigger.name.replace(/-/g, ' ');
            if (name !== 'level up') {
                triggers.push(name);
            }
        }

        return triggers.join(', ');
    };

    return {
        evolutionChains,
        loading,
        formatTriggerString
    };
};
