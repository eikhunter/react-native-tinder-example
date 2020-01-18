import * as React from 'react';
import {
    View,
    Dimensions,
    Animated,
    PanResponder, StyleSheet,
} from 'react-native';
import AgentCard from '../components/AgentCard/AgentCard';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

const agents = [
    { id: 1, uri: require('../assets/james-1.jpg') },
    { id: 2, uri: require('../assets/james-2.jpg') },
    { id: 3, uri: require('../assets/james-3.jpg') },
    { id: 4, uri: require('../assets/james-4.jpg') },
];

const initialState = () => ({
    currentIndex: 0
});

type State = ReturnType<typeof initialState>;

export default class App extends React.Component<State> {
    readonly state: State = initialState();
    panPosition = new Animated.ValueXY(); // To track the position of the card
    rotate = this.panPosition.x.interpolate({
        inputRange: [-SCREEN_WIDTH /2 ,0, SCREEN_WIDTH /2],
        outputRange: ['-30deg', '0deg', '10deg'],
        extrapolate: 'clamp'
    }); // Animation for the card rotation
    rotateAndTranslate = {
        transform: [{
            rotate: this.rotate
        },
            ...this.panPosition.getTranslateTransform()
        ]
    }; // Card rotation and movement styles
    textLeftOpacity = this.panPosition.x.interpolate({
        inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
        outputRange: [0, 0, 1],
        extrapolate: 'clamp'
    }); // Card text left animation
    textRightOpacity = this.panPosition.x.interpolate({
        inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
        outputRange: [1, 0, 0],
        extrapolate: 'clamp'
    }); // Card text right animation
    nextCardOpacity = this.panPosition.x.interpolate({
        inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
        outputRange: [1, 0, 1],
        extrapolate: 'clamp'
    })
    nextCardScale = this.panPosition.x.interpolate({
        inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
        outputRange: [1, 0.8, 1],
        extrapolate: 'clamp'
    }); // Next card scale animation
    PanResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (event, gestureState) => {
            this.panPosition.setValue({ x: gestureState.dx, y: gestureState.dy });
        },
        onPanResponderRelease: (event, gestureState) => {
            if (gestureState.dx > 120) {
                Animated.spring(this.panPosition, {
                    toValue: {
                        x: SCREEN_WIDTH + 200,
                        y: gestureState.dy
                    }}).start(() => {
                    this.setState({
                        currentIndex: this.state.currentIndex + 1
                    }, () => {
                        this.panPosition.setValue({ x: 0, y: 0 })
                    });
                });
            } else if (gestureState.dx < -120) {
                Animated.spring(this.panPosition, {
                    toValue: {
                        x: -SCREEN_WIDTH - 200,
                        y: gestureState.dy
                    }}).start(() => {
                    this.setState({
                        currentIndex: this.state.currentIndex + 1
                    }, () => {
                        this.panPosition.setValue({ x: 0, y: 0 })
                    })
                })
            } else {
                Animated.spring(this.panPosition, {
                    toValue: { x: 0, y: 0 },
                    friction: 4
                }).start()
            }
        }
    }); // Movement animation logic

    renderAgents = () => {
        const { currentIndex } = this.state;

        return agents.map((item, index) => {
            if (index < currentIndex) {
                return null;
            }

            const styles = index == currentIndex ?
                [
                    this.rotateAndTranslate,
                    {
                        position: 'absolute',
                        height: SCREEN_HEIGHT - 120,
                        width: SCREEN_WIDTH,
                        padding: 10,
                    }]
                : [{
                    position: 'absolute',
                    height: SCREEN_HEIGHT - 120,
                    width: SCREEN_WIDTH,
                    padding: 10,
                    transform: [{ scale: this.nextCardScale }],
                    opacity: this.nextCardOpacity
                }];
            const textLeftOpacity = index === currentIndex
                ? this.textLeftOpacity
                : undefined;

            const textRightOpacity = index === currentIndex
                ? this.textRightOpacity
                : undefined;

            if (index === currentIndex || index === currentIndex + 1) {
                return (
                    <AgentCard
                        key={item.id}
                        cardStyles={styles}
                        imageUri={item.uri}
                        panHandlers={this.PanResponder.panHandlers}
                        textLeftOpacity={textLeftOpacity}
                        textRightOpacity={textRightOpacity}
                    />
                )
            }
        }).reverse()
    };

    render() {
        return (
            <View style={styles.container}>
                {this.renderAgents()}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center'
    }
});


