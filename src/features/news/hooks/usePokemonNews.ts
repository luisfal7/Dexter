import { useState, useEffect } from 'react';
import * as rssParser from 'react-native-rss-parser';

// English: Interface for the structure of a news item
// Español: Interfaz para la estructura de una noticia
export interface NewsItem {
    title: string;
    published: string;
    links: { url: string }[];
}

// English: Custom hook to fetch Pokemon news
// Español: Hook personalizado para obtener noticias de Pokemon
export const usePokemonNews = () => {
    const [news, setNews] = useState<NewsItem[]>([]);
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
                    // English: Map and slice safely
                    // Español: Mapear y recortar de forma segura
                    const mappedItems: NewsItem[] = rss.items.slice(0, 5).map(item => ({
                        title: item.title || 'No Title',
                        published: item.published || new Date().toISOString(),
                        links: item.links && item.links.length > 0 ? [{ url: item.links[0].url }] : [{ url: 'https://pokemon.com' }]
                    }));
                    setNews(mappedItems);
                } else {
                    throw new Error("No items found");
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                console.warn("News fetch failed, using fallback:", errorMessage);
                // English: Fallback data
                // Español: Datos de respaldo
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

    return { news, loading };
};
