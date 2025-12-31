import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const metrics = {
    screenWidth: width,
    screenHeight: height,
    marginHorizontal: 24,
    marginVertical: 24,
    baseMargin: 10,
    doubleBaseMargin: 20,
    smallMargin: 5,
    borderRadius: 12,
    cardBorderRadius: 16,
    buttonHeight: 50,
    icons: {
        tiny: 15,
        small: 20,
        medium: 24,
        large: 32,
        xl: 40,
    },
};

export default metrics;
