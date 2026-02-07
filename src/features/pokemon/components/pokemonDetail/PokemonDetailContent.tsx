import React from 'react';
import { usePokemonDetails } from '../../hooks/usePokemonDetails';
import PokemonDetailView from './PokemonDetailView';
import { Pokemon } from '../../types';

// English: Props for the container component
// Español: Props para el componente contenedor
interface PokemonDetailContentProps {
    pokemon: Pokemon;
    color?: string;
    onBackPressed: () => void;
}

// English: Container component managing logic and state for details
// Español: Componente contenedor gestionando lógica y estado para detalles
const PokemonDetailContent: React.FC<PokemonDetailContentProps> = ({ pokemon, color, onBackPressed }) => {
    // English: Use the custom hook to get data and logic
    // Español: Usar el hook personalizado para obtener datos y lógica
    const {
        details,
        species,
        isFavorite,
        toggleFavorite
    } = usePokemonDetails(pokemon);

    return (
        <PokemonDetailView
            pokemon={pokemon}
            details={details}
            species={species}
            onBackPressed={onBackPressed}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
        />
    );
};

export default PokemonDetailContent;
