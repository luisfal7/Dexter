import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';
import { Image } from 'expo-image';
import * as rssParser from 'react-native-rss-parser';
import { useRouter } from 'expo-router';
import { colors, metrics } from '../../../theme';
// ... imports

const PokemonNews = () => {
    const router = useRouter(); // Use router
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const GOOGLE_NEWS_RSS_URL = 'https://news.google.com/rss/search?q=Pokemon&hl=en-US&gl=US&ceid=US:en';

    useEffect(() => {
        const fetchNews = async () => {
            try {
                // Time-boxed fetch
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 5000);

                const response = await fetch(GOOGLE_NEWS_RSS_URL, { signal: controller.signal });
                clearTimeout(timeoutId);

                const responseText = await response.text();
                const rss = await rssParser.parse(responseText);

                if (rss.items && rss.items.length > 0) {
                    setNews(rss.items.slice(0, 5));
                } else {
                    throw new Error("No items found");
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                console.warn("News fetch failed, using fallback:", errorMessage);
                setNews([
                    {
                        title: "Pokemon Legends: Z-A Announced for 2025",
                        published: new Date().toISOString(),
                        links: [{ url: "https://www.pokemon.com/us" }]
                    },
                    {
                        title: "New Mystery Gift Code Available for Scarlet & Violet",
                        published: new Date(Date.now() - 86400000).toISOString(),
                        links: [{ url: "https://www.pokemon.com/us" }]
                    },
                    {
                        title: "Pokemon GO Community Day: Chansey",
                        published: new Date(Date.now() - 172800000).toISOString(),
                        links: [{ url: "https://pokemongolive.com" }]
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    const handlePress = (url: string) => {
        Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Pokemon News</Text>
                <Text style={styles.viewAll} onPress={() => router.push('/news')}>View All</Text>
            </View>

            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : news.length === 0 ? (
                <View style={styles.loadingContainer}>
                    <Text style={{ textAlign: 'center', color: colors.grey, marginTop: 10 }}>No news found.</Text>
                </View>
            ) : (
                news.map((item, index) => (
                    <TouchableOpacity key={index} style={styles.newsItem} onPress={() => handlePress(item.links[0].url)}>
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
                ))
            )}
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
    },
    loadingContainer: {
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
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

export default PokemonNews;
