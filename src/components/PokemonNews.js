import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';
import * as rssParser from 'react-native-rss-parser';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../theme/colors';
import metrics from '../theme/metrics';

const GOOGLE_NEWS_RSS_URL = 'https://news.google.com/rss/search?q=Pokemon&hl=en-US&gl=US&ceid=US:en';

const PokemonNews = () => {
    const navigation = useNavigation();
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch(GOOGLE_NEWS_RSS_URL);
                const responseText = await response.text();
                const rss = await rssParser.parse(responseText);

                // Take top 5 items
                setNews(rss.items.slice(0, 5));
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

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Pokemon News</Text>
                <Text style={styles.viewAll} onPress={() => navigation.navigate('NewsList')}>View All</Text>
            </View>

            {news.map((item, index) => (
                <TouchableOpacity key={index} style={styles.newsItem} onPress={() => handlePress(item.links[0].url)}>
                    <View style={styles.newsContent}>
                        <Text style={styles.newsHeadline} numberOfLines={2}>{item.title}</Text>
                        <Text style={styles.newsDate}>{new Date(item.published).toDateString()}</Text>
                    </View>
                    <View style={styles.newsImagePlaceholder}>
                        {/* Google News RSS rarely gives good images, using generic fallback or generating one based on content would be hard. Using a nice styled placeholder icon or random pokeball */}
                        <Image
                            style={styles.newsImage}
                            source={{ uri: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png' }}
                        />
                    </View>
                </TouchableOpacity>
            ))}
        </View>
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
        resizeMode: 'contain',
        opacity: 0.5,
    }
});

export default PokemonNews;
