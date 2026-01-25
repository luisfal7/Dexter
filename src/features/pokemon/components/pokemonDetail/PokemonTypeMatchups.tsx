import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../../../../theme';
import { getTypeDetails } from '../../../../services';

interface PokemonTypeMatchupsProps {
    types: { type: { name: string; url: string } }[];
}

const PokemonTypeMatchups: React.FC<PokemonTypeMatchupsProps> = ({ types }) => {
    const [superWeak, setSuperWeak] = useState<string[]>([]);
    const [weak, setWeak] = useState<string[]>([]);
    const [normal, setNormal] = useState<string[]>([]);
    const [resistant, setResistant] = useState<string[]>([]);
    const [superResistant, setSuperResistant] = useState<string[]>([]);
    const [immune, setImmune] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMatchups = async () => {
            if (!types || types.length === 0) return;

            try {
                // Map to track damage multiplier for each attacking type
                // Key: Attacking Type, Value: Multiplier (starts at 1)
                const damageMap: Record<string, number> = {};

                // Initialize all types with 1x damage (Normal)
                // We need a list of all types to ensure 'Normal' category is populated correctly
                // or we can just assume types not found in relations are 1x.
                // But relations from API cover 'double', 'half', 'no'. Implicitly others are 1x.
                // However, getting ALL types requires an extra call or hardcoded list. 
                // A better approach for "Normal": track keys modified. 
                // Actually, purely dynamic approach:
                // We can't easily list "Normal" types without knowing the full set of 18 types.
                // Let's assume we want to show types that are EXPLICITLY computed, 
                // but since 1x is the default, we need the full list of types to show what remains at 1x.

                // Hardcoded list of standard types to initialize map
                const allTypes = [
                    'normal', 'fire', 'water', 'electric', 'grass', 'ice',
                    'fighting', 'poison', 'ground', 'flying', 'psychic',
                    'bug', 'rock', 'ghost', 'dragon', 'steel', 'dark', 'fairy'
                ];

                allTypes.forEach(type => damageMap[type] = 1);

                await Promise.all(types.map(async (t) => {
                    const typeData = await getTypeDetails(t.type.url);

                    // Defensive Matchups
                    typeData.damage_relations.double_damage_from.forEach((source: any) => {
                        damageMap[source.name] *= 2;
                    });

                    typeData.damage_relations.half_damage_from.forEach((source: any) => {
                        damageMap[source.name] *= 0.5;
                    });

                    typeData.damage_relations.no_damage_from.forEach((source: any) => {
                        damageMap[source.name] *= 0;
                    });
                }));

                const sWeak: string[] = [];
                const wk: string[] = [];
                const nrm: string[] = [];
                const res: string[] = [];
                const sRes: string[] = [];
                const imm: string[] = [];

                for (const [type, multiplier] of Object.entries(damageMap)) {
                    if (multiplier === 4) sWeak.push(type);
                    else if (multiplier === 2) wk.push(type);
                    else if (multiplier === 1) nrm.push(type);
                    else if (multiplier === 0.5) res.push(type);
                    else if (multiplier === 0.25) sRes.push(type);
                    else if (multiplier === 0) imm.push(type);
                }

                setSuperWeak(sWeak);
                setWeak(wk);
                setNormal(nrm);
                setResistant(res);
                setSuperResistant(sRes);
                setImmune(imm);

            } catch (error) {
                console.error("Failed to load type matchups", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMatchups();
    }, [types]);

    if (loading) {
        return <ActivityIndicator size="small" color={colors.primary} />;
    }

    if (!types) return null;

    // Mapping based on the visual style of Pokemon types
    const getIconName = (type: string): any => {
        switch (type) {
            case 'fire': return 'fire';
            case 'water': return 'water';
            case 'electric': return 'flash';
            case 'grass': return 'leaf';
            case 'ice': return 'snowflake';
            case 'fighting': return 'boxing-glove';
            case 'poison': return 'skull';
            case 'ground': return 'terrain';
            case 'flying': return 'feather';
            case 'psychic': return 'debian';
            case 'bug': return 'ladybug';
            case 'rock': return 'cube';
            case 'ghost': return 'ghost';
            case 'dragon': return 'snake';
            case 'steel': return 'nut';
            case 'fairy': return 'star-four-points';
            case 'normal': return 'circle-outline';
            case 'dark': return 'moon-waning-crescent';
            default: return 'help';
        }
    };

    const renderTypeRow = (title: string, typeList: string[]) => {
        if (!typeList || typeList.length === 0) return null;
        return (
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>{title}</Text>
                <View style={styles.typeRow}>
                    {typeList.map((type, index) => {
                        const colorKey = type as keyof typeof colors.types;
                        return (
                            <View key={index} style={[styles.typePill, { backgroundColor: colors.types[colorKey] || colors.grey }]}>
                                <MaterialCommunityIcons name={getIconName(type)} size={16} color="white" />
                            </View>
                        );
                    })}
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {renderTypeRow("4x Super Weak", superWeak)}
            {renderTypeRow("2x Weak", weak)}
            {renderTypeRow("1x Normal", normal)}
            {renderTypeRow("1/2 Resistant", resistant)}
            {renderTypeRow("1/4 Super Resistant", superResistant)}
            {renderTypeRow("0 Immune", immune)}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    sectionContainer: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 10,
        marginLeft: 10,
    },
    typeRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 10,
    },
    typePill: {
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        marginBottom: 10,
    },
});

export default PokemonTypeMatchups;
