import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

const PokemonStats = ({ stats, color }) => {
    return (
        <View>
            {stats?.map(stat => (
                <View key={stat.stat.name} style={styles.statBarRow}>
                    <Text style={styles.statName}>{stat.stat.name.toUpperCase()}</Text>
                    <Text style={styles.statNum}>{stat.base_stat}</Text>
                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${(stat.base_stat / 255) * 100}%`, backgroundColor: color }]} />
                    </View>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    statBarRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    statName: {
        width: 50,
        color: colors.grey,
        fontSize: 12,
        fontWeight: 'bold',
    },
    statNum: {
        width: 40,
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.text,
        textAlign: 'right',
        marginRight: 10,
    },
    progressBarBg: {
        flex: 1,
        height: 4,
        backgroundColor: colors.lightGrey,
        borderRadius: 2,
    },
    progressBarFill: {
        height: 4,
        borderRadius: 2,
    },
});

export default PokemonStats;
