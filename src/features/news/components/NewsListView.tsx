import React from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, metrics } from '../../../theme';

interface NewsItem {
    title: string;
    published: string;
    links: { url: string }[];
}

interface NewsListViewProps {
    news: NewsItem[];
    loading: boolean;
    onNewsPress: (url: string) => void;
    onBack?: () => void;
}

const NewsListView: React.FC<NewsListViewProps> = ({ news, loading, onNewsPress, onBack }) => {

    const renderItem = ({ item }: { item: NewsItem }) => (
        <TouchableOpacity style={styles.newsItem} onPress={() => onNewsPress(item.links[0].url)}>
            <View style={styles.newsContent}>
                <Text style={styles.newsHeadline} numberOfLines={3}>{item.title}</Text>
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
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Pokemon News</Text>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={news}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
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
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: metrics.marginHorizontal,
    },
    newsItem: {
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        marginBottom: 15,
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
        width: 30, // Pokeball icon size
        height: 30,
        opacity: 0.5,
    }
});

export default NewsListView;
