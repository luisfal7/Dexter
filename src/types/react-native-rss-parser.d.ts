declare module 'react-native-rss-parser' {
    export interface RSSItem {
        id: string;
        title: string;
        description: string;
        links: { url: string }[];
        published: string;
    }
    export interface RSS {
        items: RSSItem[];
    }
    export function parse(feed: string): Promise<RSS>;
}
