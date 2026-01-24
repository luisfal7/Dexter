import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { colors, metrics } from '../../../theme';

import { StyleProp, ViewStyle } from 'react-native';

interface PokemonCardProps {
  name: string;
  id: string | number;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ name, id, onPress, style }) => {
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  const formattedId = `#${id.toString().padStart(3, '0')}`;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={[styles.container, style]}
    >
      <View style={styles.idContainer}>
        <Text style={styles.idText}>{formattedId}</Text>
      </View>
      <Image
        source={{ uri: imageUrl }}
        style={styles.image}
        contentFit="contain"
      />
      <Text style={styles.name}>{name.charAt(0).toUpperCase() + name.slice(1)}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: metrics.borderRadius,
    padding: 10,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    flex: 0.48, // Grid item
  },
  idContainer: {
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(72, 208, 176, 0.2)', // Light green
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 5,
  },
  idText: {
    color: colors.secondary, // Green text
    fontSize: 10,
    fontWeight: 'bold',
  },
  image: {
    width: 100,
    height: 100,
    marginVertical: 5,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 5,
  }
});

export default React.memo(PokemonCard);
