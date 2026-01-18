import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { colors } from '../theme/colors';
import metrics from '../theme/metrics';
import CategoryCard from '../components/CategoryCard';
import { getGenerations } from '../services/api';

// Pastel colors for generations to look nice
const genColors = [
    '#FF9D5C', // Orange
    '#4AD0B2', // Teal
    '#58ABF6', // Blue
    '#FAE078', // Yellow
    '#B1736C', // Reddish
    '#9A6CB9', // Purple
    '#EA686D', // Red
    '#8B9B9B', // Grey
];

const GenerationsListScreen = ({ navigation }) => {
    const { data: generations = [], isLoading: loading } = useQuery({
        queryKey: ['generations'],
        queryFn: async () => {
            const data = await getGenerations();
            return data.results;
        }
    });

    const formatName = (name) => {
        // "generation-i" -> "Generation I"
        const parts = name.split('-');
        if (parts.length === 2) {
            return `Generation ${parts[1].toUpperCase()}`;
        }
        return name;
    }

    const renderItem = ({ item, index }) => {
        const color = genColors[index % genColors.length];
        return (
            <CategoryCard
                title={formatName(item.name)}
                color={color}
                style={styles.card}
                onPress={() => navigation.navigate('PokemonList', { generation: item.name, title: formatName(item.name) })}
            />
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Generations</Text>
            </View>

            <View style={styles.content}>
                <FlatList
                    data={generations}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.name}
                    numColumns={2}
                    contentContainerStyle={styles.listContent}
                    columnWrapperStyle={styles.columnWrapper}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        paddingHorizontal: metrics.marginHorizontal,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.text,
    },
    content: {
        flex: 1,
        paddingTop: 20,
    },
    listContent: {
        paddingHorizontal: metrics.marginHorizontal,
        paddingBottom: 20,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    card: {
        flex: 0.48,
        marginBottom: 15,
        height: 100, // Taller cards for Generations look good
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default GenerationsListScreen;
