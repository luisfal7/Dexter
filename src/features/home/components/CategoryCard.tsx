import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, metrics } from '../../../theme';

interface CategoryCardProps {
    title: string;
    color: string;
    onPress: () => void;
    icon?: keyof typeof Ionicons.glyphMap | null;
    style?: StyleProp<ViewStyle>;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, color, onPress, style, icon }) => {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}
            style={[styles.container, style, { backgroundColor: color }]}
        >
            {/* Decorative circle */}
            <View style={styles.circle} />
            <View style={styles.content}>
                <Text style={styles.title}>{title}</Text>
                {icon && <View style={styles.iconContainer}>
                    <Ionicons name={icon} size={24} color="rgba(255,255,255,0.4)" />
                </View>}
            </View>
            <ImageOverlay />
        </TouchableOpacity>
    );
};

// Placeholder for the Pokeball overlay pattern
const ImageOverlay = () => (
    <View style={styles.pokeballOverlay}>
        <View style={styles.pokeballLine} />
        <View style={styles.pokeballCircle} />
    </View>
);

const styles = StyleSheet.create({
    container: {
        height: 65,
        borderRadius: 15,
        paddingHorizontal: 20,
        justifyContent: 'center',
        marginBottom: 15,
        overflow: 'hidden',
        position: 'relative',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 2,
    },
    title: {
        color: colors.textLight,
        fontSize: 16,
        fontWeight: 'bold',
    },
    circle: {
        position: 'absolute',
        left: -15,
        top: -15,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.2)',
        zIndex: 1,
    },
    pokeballOverlay: {
        position: 'absolute',
        right: -10,
        top: -10,
        width: 60,
        height: 60,
        opacity: 0.3,
        zIndex: 1,
    },
    pokeballLine: {
        // Simple CSS shapes for pokeball could go here, 
        // but for now keeping it simple or using an Image if I had one.
        // Making a simple circle for "artistic" feel
        position: 'absolute',
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255,255,255,0.2)', // Adjusted alpha
        right: 0,
        top: 0,
    },
    pokeballCircle: {
        position: 'absolute',
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: 'rgba(255,255,255,0.2)',
        right: 17, // roughly centered relative to 50px line/circle
        top: 17,
        zIndex: 2,
    },
    iconContainer: {
        marginLeft: 10,
        padding: 5,
        borderRadius: 15,
        backgroundColor: 'rgba(255,255,255,0.1)'
    }
});

export default CategoryCard;
