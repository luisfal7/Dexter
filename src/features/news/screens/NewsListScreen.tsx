import React, { useState, useEffect } from 'react';
import { Linking } from 'react-native';
import * as rssParser from 'react-native-rss-parser';
import NewsListView from '../components/NewsListView';

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

    return (
        <NewsListView
            news={news}
            loading={loading}
            onNewsPress={handlePress}
            onBack={() => navigation.goBack()}
        />
    );
};

export default NewsListScreen;
