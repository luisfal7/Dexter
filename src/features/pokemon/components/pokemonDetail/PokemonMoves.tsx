import React from 'react';
import { Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../../../../theme';

interface PokemonMovesProps {
    moves: {
        move: {
            name: string;
            url: string;
        };
    }[];
}

const PokemonMoves: React.FC<PokemonMovesProps> = ({ moves }) => {
    return (
        <ScrollView>
            {moves?.slice(0, 10).map(move => (
                <Text key={move.move.name} style={styles.moveText}>{move.move.name.replace('-', ' ')}</Text>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    moveText: {
        fontSize: 14,
        color: colors.text,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.lightGrey,
        paddingBottom: 5,
    }
});

export default PokemonMoves;
