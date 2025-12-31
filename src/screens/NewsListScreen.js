import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, TouchableOpacity, Linking, SafeAreaView } from 'react-native';
import * as rssParser from 'react-native-rss-parser';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import metrics from '../theme/metrics';

const GOOGLE_NEWS_RSS_URL = 'https://news.google.com/rss/search?q=Pokemon&hl=en-US&gl=US&ceid=US:en';

const NewsListScreen = ({ navigation }) => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch(GOOGLE_NEWS_RSS_URL);
                const responseText = await response.text();
                const rss = await rssParser.parse(responseText);
                setNews(rss.items); // Fetch all items
            } catch (error) {
                console.error("Failed to fetch news:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    const handlePress = (url) => {
        Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.newsItem} onPress={() => handlePress(item.links[0].url)}>
            <View style={styles.newsContent}>
                <Text style={styles.newsHeadline} numberOfLines={3}>{item.title}</Text>
                <Text style={styles.newsDate}>{new Date(item.published).toDateString()}</Text>
            </View>
            <View style={styles.newsImagePlaceholder}>
                <Image
                    style={styles.newsImage}
                    source={{ uri: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png' }}
                />
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
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
        width: 30,
        height: 30,
        resizeMode: 'contain',
        opacity: 0.5,
    }
});

export default NewsListScreen;
