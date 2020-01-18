import * as React from 'react';
import {
    Animated,
    GestureResponderHandlers,
    Image,
    ImageSourcePropType,
    Text,
    StyleSheet
} from 'react-native';

interface Props {
    cardStyles: Object;
    imageUri: ImageSourcePropType;
    panHandlers: GestureResponderHandlers;
    textLeftOpacity?: Animated.AnimatedInterpolation;
    textRightOpacity?: Animated.AnimatedInterpolation;
}

const AgentCard: React.FC<Props> = ({
                                        cardStyles,
                                        imageUri,
                                        panHandlers,
                                        textLeftOpacity,
                                        textRightOpacity
                                    }) => {
    return (
        <Animated.View
            {...panHandlers}
            style={cardStyles}>
            <Animated.View
                style={[
                    { opacity: textRightOpacity ? textRightOpacity : 0 },
                    styles.textContainer,
                    styles.textContainerRight
                ]}>
                <Text style={[styles.text, styles.textGreen]}>HIRE</Text>
            </Animated.View>

            <Animated.View
                style={[
                    { opacity: textLeftOpacity ? textLeftOpacity : 0 },
                    styles.textContainer,
                    styles.textContainerLeft
                ]}>
                <Text style={[styles.text, styles.textRed]}>FIRE</Text>
            </Animated.View>

            <Image
                style={styles.image}
                source={imageUri} />
        </Animated.View>
    );
};

export default AgentCard;

const styles = StyleSheet.create({
    image: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'cover',
        borderRadius: 20
    },
    text: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 6,
        fontSize: 32,
        fontWeight: '800',
    },
    textContainer: {
        position: 'absolute',
        top: 50,
        zIndex: 1
    },
    textContainerLeft: {
        left: 40,
        transform: [{
            rotate: '-30deg'
        }]
    },
    textContainerRight: {
        right: 40,
        transform: [{
            rotate: '30deg'
        }]
    },
    textRed: {
        borderColor: '#c64032',
        color: '#c64032',
    },
    textGreen: {
        borderColor: '#69d974',
        color: '#69d974',
    },
});
