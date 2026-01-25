import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, metrics } from '../../../theme';

const generations = [
    { id: 1, name: 'Generation I', region: 'Kanto', starters: [1, 4, 7] },
    { id: 2, name: 'Generation II', region: 'Johto', starters: [152, 155, 158] },
    { id: 3, name: 'Generation III', region: 'Hoenn', starters: [252, 255, 258] },
    { id: 4, name: 'Generation IV', region: 'Sinnoh', starters: [387, 390, 393] },
    { id: 5, name: 'Generation V', region: 'Unova', starters: [495, 498, 501] },
    { id: 6, name: 'Generation VI', region: 'Kalos', starters: [650, 653, 656] },
    { id: 7, name: 'Generation VII', region: 'Alola', starters: [722, 725, 728] },
    { id: 8, name: 'Generation VIII', region: 'Galar', starters: [810, 813, 816] },
];

const GenerationsListScreen = () => {
    const router = useRouter();

    const renderItem = ({ item }: { item: typeof generations[0] }) => (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.9}
            onPress={() => router.push({
                pathname: '/pokemon/list',
                params: { generation: item.id, title: item.name }
            })}
        >
            <View style={styles.cardContent}>
                <Text style={styles.genName}>{item.name}</Text>
                <Text style={styles.regionName}>{item.region}</Text>
            </View>
            <View style={styles.startersContainer}>
                {item.starters.map((id, index) => (
                    <Image
                        key={id}
                        source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png` }}
                        style={[
                            styles.starterImage,
                            { zIndex: 3 - index, transform: [{ translateX: index * -15 }] }
                        ]}
                        contentFit="contain"
                    />
                ))}
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Generations</Text>
            </View>
            <FlatList
                data={generations}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.list}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        paddingHorizontal: metrics.marginHorizontal,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.text,
        marginLeft: 10,
    },
    list: {
        padding: metrics.marginHorizontal,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 15,
        marginBottom: 15,
        height: 110,
        flexDirection: 'row',
        justifyContent: 'space-between',
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
        flex: 1,
    },
    genName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
    },
    regionName: {
        fontSize: 14,
        color: colors.grey,
        marginTop: 5,
    },
    startersContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 10,
    },
    starterImage: {
        width: 80,
        height: 80,
    }
});

export default GenerationsListScreen;
