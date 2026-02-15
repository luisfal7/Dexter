import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, metrics } from '../../../../theme';

// English: Props for the PokemonCoach component
// Español: Props para el componente PokemonCoach
interface PokemonCoachProps {
    tip: string;
}

// English: Component to display the strategic coach tip
// Español: Componente para mostrar el consejo estratégico del entrenador
const PokemonCoach: React.FC<PokemonCoachProps> = ({ tip }) => {
    return (
        <View>
            <Text style={styles.description}>
                {tip || "No strategic tip available for this Pokémon yet."}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    description: {
        lineHeight: 22,
        color: colors.text,
        marginBottom: 20,
    },
    /* tipText removed as requested */
});

export default PokemonCoach;
