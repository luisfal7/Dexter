import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../../../../theme';
interface PokemonAboutProps {
    description: string;
    height: number;
    weight: number;
}

const PokemonAbout: React.FC<PokemonAboutProps> = ({ description, height, weight }) => {
    return (
        <View>
            <Text style={styles.description}>{description}</Text>

            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Height</Text>
                    <Text style={styles.statValue}>{height / 10} m</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Weight</Text>
                    <Text style={styles.statValue}>{weight / 10} kg</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    description: {
        lineHeight: 22,
        color: colors.text,
        marginBottom: 20,
    },
    statsRow: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        marginBottom: 20,
        justifyContent: 'space-around'
    },
    statItem: {
        alignItems: 'center',
    },
    statLabel: {
        color: colors.grey,
        marginBottom: 5,
        fontSize: 12,
    },
    statValue: {
        color: colors.text,
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default PokemonAbout;
