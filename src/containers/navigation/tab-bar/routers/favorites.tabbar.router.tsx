import { createStackNavigator } from 'react-navigation';
import Favorites from '../../../../screens/favorite.characters';
import ProfileInformation from '../../../../screens/profile.information';
import { Easing, Animated } from 'react-native';

const TransitionConfiguration = () => {
    return {
        transitionSpec: {
            duration: 750,
            easing: Easing.out(Easing.poly(4)),
            timing: Animated.timing,
            useNativeDriver: true,
        },
        screenInterpolator: (sceneProps: any) => {
            const { layout, position, scene } = sceneProps;
            const width = layout.initWidth;
            const { index, route } = scene
            const params = route.params || {};
            const transition = params.transition || 'default';
            return {
                default: SlideFromRight(index, position, width),
            }[transition];
        },
    }
}

const SlideFromRight = (index: any, position: any, width: any) => {
    let indexStackNav = index > 2 ? 2 : index
    const translateX = position.interpolate({
        inputRange: [indexStackNav - 1, indexStackNav, indexStackNav + 1],
        outputRange: [width, 0, 0]
    })
    const slideFromRight = { transform: [{ translateX }] }
    return slideFromRight
};

export default createStackNavigator({
    Favorites,
    ProfileInformation
}, {
    initialRouteName: "Favorites",
    headerLayoutPreset: 'center',
    defaultNavigationOptions: {
        headerStyle: {
            backgroundColor: '#fd2e45',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
    },
    transitionConfig: TransitionConfiguration
})