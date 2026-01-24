import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, metrics } from '../../../theme';

const PrivacyPolicyScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Privacy Policy</Text>
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
                <Text style={styles.lastUpdate}>Last updated: December 31, 2025</Text>
                <Text style={styles.paragraph}>
                    This Privacy Policy describes how data is handled in the <Text style={styles.bold}>Dexter App</Text>, developed by <Text style={styles.bold}>luisfal7</Text>.
                </Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>1. Information Collection</Text>
                    <Text style={styles.paragraph}>
                        Our application is purely informative. <Text style={styles.bold}>We do not collect, request, or store any personally identifiable information</Text> from users (such as names, emails, locations, or device files).
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>2. Use of Third-Party APIs</Text>
                    <Text style={styles.paragraph}>
                        The application uses the following services to function, which have their own privacy policies:
                    </Text>
                    <View style={styles.listItem}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.paragraph}><Text style={styles.bold}>PokeAPI:</Text> Used to obtain statistical data about Pokémon.</Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.paragraph}><Text style={styles.bold}>Google News RSS:</Text> Used to display current news. When clicking on a news item, the user is redirected to third-party external websites.</Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.paragraph}><Text style={styles.bold}>GitHub:</Text> The source code is hosted on GitHub, but we do not collect data from visitors through the app.</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>3. Children's Privacy</Text>
                    <Text style={styles.paragraph}>
                        We comply with child protection regulations. Since we do not collect any data, the application is safe for users of all ages, including children under 13.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>4. Application Permissions</Text>
                    <Text style={styles.paragraph}>
                        The application only requires <Text style={styles.bold}>Internet Access</Text> permission to download Pokémon information and real-time news.
                    </Text>
                </View>

                <View style={styles.contactSection}>
                    <Text style={styles.sectionTitle}>5. Contact</Text>
                    <View style={styles.contactBox}>
                        <Text style={styles.paragraph}>If you have any questions about this policy, you can contact me through my GitHub profile:</Text>
                        <Text style={styles.paragraph}><Text style={styles.bold}>Developer:</Text> luisfal7</Text>
                        <TouchableOpacity onPress={() => Linking.openURL('https://github.com/luisfal7/Dexter')}>
                            <Text style={styles.link}><Text style={styles.bold}>Project:</Text> Dexter-App</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
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
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    backButton: {
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    lastUpdate: {
        fontSize: 12,
        color: colors.grey,
        marginBottom: 20,
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text, // Reddish color from HTML h1 style if desired, or app theme text
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        paddingBottom: 5,
    },
    paragraph: {
        fontSize: 14,
        color: '#333',
        lineHeight: 22,
        marginBottom: 5,
    },
    bold: {
        fontWeight: 'bold',
    },
    listItem: {
        flexDirection: 'row',
        marginBottom: 5,
        paddingLeft: 10,
    },
    bullet: {
        fontSize: 14,
        marginRight: 5,
        color: '#333',
    },
    contactSection: {
        marginBottom: 20,
    },
    contactBox: {
        backgroundColor: '#f4f4f4', // From HTML .contact style
        padding: 15,
        borderRadius: 8,
    },
    link: {
        color: colors.tertiary,
        textDecorationLine: 'underline',
        marginTop: 5,
    }
});

export default PrivacyPolicyScreen;
