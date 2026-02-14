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
        <View style={styles.container}>
            <Text style={styles.title}>VGC Coach Tip</Text>
            <View style={styles.card}>
                <Text style={styles.tipText}>
                    {tip || "No strategic tip available for this Pokémon yet."}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingTop: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 15,
        alignSelf: 'flex-start',
    },
    card: {
        backgroundColor: '#f5f5f5',
        borderRadius: 15,
        padding: 20,
        width: '100%',
        borderLeftWidth: 5,
        borderLeftColor: colors.primary,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    tipText: {
        fontSize: 16,
        color: '#333',
        lineHeight: 24,
        fontStyle: 'italic',
    }
});

export default PokemonCoach;
