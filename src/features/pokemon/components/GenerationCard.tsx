import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { colors } from '../../../theme';

interface Starter {
    id: number;
    image: string;
}

interface GenerationCardProps {
    name: string;
    region: string;
    starters: Starter[];
    onPress: () => void;
}

const GenerationCard: React.FC<GenerationCardProps> = React.memo(({ name, region, starters, onPress }) => {
    return (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={onPress}
        >
            <View style={styles.cardContent}>
                <Text style={styles.genName}>{name}</Text>
                <Text style={styles.regionName}>{region}</Text>
            </View>
            <View style={styles.startersContainer}>
                {starters.map((starter, index) => {
                    const isMiddle = index === 1;
                    const size = isMiddle ? 69 : 60; // 15% larger for middle

                    return (
                        <Image
                            key={starter.id}
                            source={{ uri: starter.image }}
                            style={[
                                styles.starterImage,
                                {
                                    width: size,
                                    height: size,
                                    zIndex: isMiddle ? 10 : 0,
                                    marginLeft: index === 0 ? 0 : -15, // Negative margin for overlap
                                    // Remove transform
                                }
                            ]}
                            contentFit="contain"
                        />
                    );
                })}
            </View>
        </TouchableOpacity>
    );
});

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 15,
        marginBottom: 15,
        height: 100,
        flexDirection: 'row',
        justifyContent: 'space-between', // Keeps them apart
        alignItems: 'center',
        paddingHorizontal: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        overflow: 'hidden'
    },
    cardContent: {
        justifyContent: 'center',
        alignItems: 'flex-start', // Align text to the left
        flex: 1,
    },
    genName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
        textAlign: 'left',
    },
    regionName: {
        fontSize: 14,
        color: colors.grey,
        marginTop: 5,
        textAlign: 'left',
    },
    startersContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end', // Ensure content aligns right if container grows
    },
    starterImage: {
    }
});

export default GenerationCard;
