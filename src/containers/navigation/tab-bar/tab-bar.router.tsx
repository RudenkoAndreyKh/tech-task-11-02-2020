import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import TabBarComponent from './tab-bar-component';
import SearchTabsRoute from "./routers/search.tabbar.router"
import FavoritesTabsRoute from "./routers/favorites.tabbar.router"
import React from 'react'

const BottomTabs = createBottomTabNavigator({
    PlanetList: {
        screen: SearchTabsRoute,
        navigationOptions: {
            title: "PlanetList",
        },
    },
    Favorites: {
        screen: FavoritesTabsRoute,
        navigationOptions: {
            title: 'Favorites',
        }
    }
},
    {
        initialRouteName: 'PlanetList',
        animationEnabled: true,
        tabBarComponent: ({ navigation }) => <TabBarComponent navigation={navigation} />,
        tabBarPosition: 'bottom',
    }
);

SearchTabsRoute.navigationOptions = ({ navigation }: any) => {
    let tabBarVisible = false;
    let routeName = navigation.state.routes[navigation.state.index].routeName
    if (routeName == 'PlanetList') {
        tabBarVisible = true;
    }
    return {
        tabBarVisible,
    }
}
FavoritesTabsRoute.navigationOptions = ({ navigation }: any) => {
    let tabBarVisible = false;
    let routeName = navigation.state.routes[navigation.state.index].routeName
    if (routeName == 'Favorites') {
        tabBarVisible = true;
    }
    return {
        tabBarVisible,
    }
}

export default createStackNavigator({ BottomTabs }, { headerMode: "none" });