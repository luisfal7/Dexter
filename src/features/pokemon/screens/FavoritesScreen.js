import React from 'react';
import { usePokemonStore } from '../../../store/usePokemonStore';
import { FavoritesView } from '../components';
import { colors } from '../../../theme';

const FavoritesScreen = ({ navigation }) => {
    const { favorites } = usePokemonStore();

    const handleSelectPokemon = (item) => {
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
