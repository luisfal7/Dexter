import React, { useMemo, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Linking, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { colors, metrics } from '../../../theme';
import { usePokemonNews, NewsItem } from '../hooks/usePokemonNews';

const { width } = Dimensions.get('window');

// English: Component to display Pokemon news in a Bottom Sheet
// Español: Componente para mostrar noticias de Pokemon en una hoja inferior
const PokemonNews = () => {
    const router = useRouter();
    const { news, loading } = usePokemonNews();
    const bottomSheetRef = useRef<BottomSheet>(null);

    // English: Snap points for the bottom sheet (25% and 90%)
    // Español: Puntos de ajuste para la hoja inferior (25% y 90%)
    const snapPoints = useMemo(() => ['25%', '90%'], []);

    const handlePress = (url: string) => {
        Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
    };

    const renderItem = ({ item }: { item: NewsItem }) => (
        <TouchableOpacity style={styles.newsItem} onPress={() => handlePress(item.links[0].url)}>
            <View style={styles.newsContent}>
                <Text style={styles.newsHeadline} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.newsDate}>{new Date(item.published).toDateString()}</Text>
            </View>
            <View style={styles.newsImagePlaceholder}>
                <Image
                    style={styles.newsImage}
                    source={{ uri: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png' }}
                    contentFit="contain"
                />
            </View>
        </TouchableOpacity>
    );

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={0}
            snapPoints={snapPoints}
            enablePanDownToClose={false}
            backgroundStyle={{ backgroundColor: '#fff', borderRadius: 30 }}
            handleIndicatorStyle={{ backgroundColor: colors.grey }}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Pokemon News</Text>
                    <Text style={styles.viewAll} onPress={() => router.push('/news')}>View All</Text>
                </View>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                ) : (
                    <BottomSheetFlatList
                        data={news}
                        keyExtractor={(_: any, index: number) => index.toString()}
                        renderItem={renderItem}
                        contentContainerStyle={styles.listContent}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </BottomSheet>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: metrics.marginHorizontal,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        marginTop: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
    },
    viewAll: {
        color: colors.tertiary,
        fontWeight: 'bold',
    },
    loadingContainer: {
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingBottom: 20,
    },
    newsItem: {
        backgroundColor: '#fff', // Or slightly different to distinguish from sheet bg
        borderRadius: 15,
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        marginBottom: 10,
    },
    newsContent: {
        flex: 1,
        paddingRight: 10,
    },
    newsHeadline: {
        fontSize: 14,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 5,
    },
    newsDate: {
        fontSize: 12,
        color: colors.grey,
    },
    newsImagePlaceholder: {
        width: 60,
        height: 40,
        backgroundColor: '#F5F5F5',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    newsImage: {
        width: 30,
        height: 30,
        opacity: 0.5,
    }
});

export default PokemonNews;
