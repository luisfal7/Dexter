import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { colors, metrics } from '../../../theme';
import { TopTierPokemon } from '../hooks/useTopTierPokemon';

interface TopTierItemProps {
    item: TopTierPokemon;
    rank: number;
    onPress: () => void;
}

const TopTierItem: React.FC<TopTierItemProps> = ({ item, rank, onPress }) => {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={styles.container}
        >
            <View style={styles.rankContainer}>
                <Text style={styles.rank}>#{rank}</Text>
            </View>

            <Image
                source={{ uri: item.sprites.other['official-artwork'].front_default }}
                style={styles.image}
                contentFit="contain"
            />

            <View style={styles.info}>
                <Text style={styles.name}>{item.name.charAt(0).toUpperCase() + item.name.slice(1)}</Text>
                <View style={styles.statsContainer}>
                    <Text style={styles.statsLabel}>Total Stats:</Text>
                    <Text style={styles.statsValue}>{item.totalStats}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: metrics.borderRadius,
        padding: 10,
        marginBottom: 10,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        marginHorizontal: metrics.marginHorizontal,
    },
    rankContainer: {
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    rank: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.grey,
    },
    image: {
        width: 60,
        height: 60,
        marginRight: 15,
    },
    info: {
        flex: 1,
        justifyContent: 'center',
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 4,
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statsLabel: {
        fontSize: 14,
        color: colors.grey,
        marginRight: 5,
    },
    statsValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.primary,
    }
});

export default React.memo(TopTierItem);
