import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import metrics from '../theme/metrics';

const PrivacyPolicyScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Política de Privacidad</Text>
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
                <Text style={styles.lastUpdate}>Última actualización: 31 de diciembre de 2025</Text>
                <Text style={styles.paragraph}>
                    Esta Política de Privacidad describe cómo se gestionan los datos en la aplicación <Text style={styles.bold}>Pokedex App</Text>, desarrollada por <Text style={styles.bold}>luisfal7</Text>.
                </Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>1. Recopilación de Información</Text>
                    <Text style={styles.paragraph}>
                        Nuestra aplicación es puramente informativa. <Text style={styles.bold}>No recopilamos, solicitamos ni almacenamos ningún tipo de información personal</Text> identificable de los usuarios (como nombres, correos electrónicos, ubicaciones o archivos del dispositivo).
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>2. Uso de APIs de Terceros</Text>
                    <Text style={styles.paragraph}>
                        La aplicación utiliza los siguientes servicios para funcionar, los cuales tienen sus propias políticas de privacidad:
                    </Text>
                    <View style={styles.listItem}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.paragraph}><Text style={styles.bold}>PokeAPI:</Text> Utilizada para obtener datos estadísticos de los Pokémon.</Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.paragraph}><Text style={styles.bold}>Google News RSS:</Text> Utilizado para mostrar noticias de actualidad. Al hacer clic en una noticia, el usuario es redirigido a sitios web externos de terceros.</Text>
                    </View>
                    <View style={styles.listItem}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.paragraph}><Text style={styles.bold}>GitHub:</Text> El código fuente está alojado en GitHub, pero no recopilamos datos de los visitantes a través de la app.</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>3. Privacidad Infantil</Text>
                    <Text style={styles.paragraph}>
                        Cumplimos con las normativas de protección de menores. Dado que no recopilamos ningún dato, la aplicación es segura para usuarios de todas las edades, incluidos niños menores de 13 años.
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>4. Permisos de la Aplicación</Text>
                    <Text style={styles.paragraph}>
                        La aplicación solo requiere permiso de <Text style={styles.bold}>Acceso a Internet</Text> para descargar la información de los Pokémon y las noticias en tiempo real.
                    </Text>
                </View>

                <View style={styles.contactSection}>
                    <Text style={styles.sectionTitle}>5. Contacto</Text>
                    <View style={styles.contactBox}>
                        <Text style={styles.paragraph}>Si tienes alguna duda sobre esta política, puedes contactarme a través de mi perfil de GitHub:</Text>
                        <Text style={styles.paragraph}><Text style={styles.bold}>Desarrollador:</Text> luisfal7</Text>
                        <TouchableOpacity onPress={() => Linking.openURL('https://github.com/luisfal7/Pokedex-App')}>
                            <Text style={styles.link}><Text style={styles.bold}>Proyecto:</Text> Pokedex-App</Text>
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
