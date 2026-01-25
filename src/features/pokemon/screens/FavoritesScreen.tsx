import React from 'react';
import { usePokemonStore } from '../../../store/usePokemonStore';
import { FavoritesView } from '../components';
import { colors } from '../../../theme';
import { Pokemon } from '../../../types';

interface FavoritesScreenProps {
    navigation: {
        navigate: (screen: string, params: any) => void;
        goBack: () => void;
    };
}

const FavoritesScreen: React.FC<FavoritesScreenProps> = ({ navigation }) => {
    const { favorites } = usePokemonStore();

    const handleSelectPokemon = (item: Pokemon) => {
        navigation.navigate('PokemonDetail', {
            pokemon: item,
            color: colors.primary // Default color or could look up type color if stored
        });
    };

    return (
        <FavoritesView
            favorites={favorites}
            onSelectPokemon={handleSelectPokemon}
            onBack={() => navigation.goBack()}
        />
    );
};

export default FavoritesScreen;
