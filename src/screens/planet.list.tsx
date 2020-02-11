import React, { Component, } from 'react';
import { FlatList, Text, View, TouchableOpacity, Keyboard, KeyboardAvoidingView, RefreshControl, ActivityIndicator, Image } from 'react-native';
import Loader from '../shared/components/loader';
import DelayInput from "react-native-debounce-input";
import { NavigationScreenProp, NavigationState, NavigationParams, SafeAreaView } from "react-navigation";
import PlanetService from '../services/planet.service';
import { Planet } from '../shared/models/planet.model';
import { styles } from '../styles/planet.list';

interface Props {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>
};

interface State {
    isLoading: boolean,
    planets: Planet[],
    filteredData: Planet[],
    page: number,
    isAnyPages: boolean,
    isTyping: boolean,
    searchParam: string,
}

class PlanetList extends Component<Props, State> {
    static navigationOptions = ({ navigation }: NavigationParams) => {
        return {
            headerTitle: 'Planets',
        };
    };

    private onEndReachedCalledDuringMomentum = true;
    private keyboardDidShowListener: any;
    private keyboardDidHideListener: any;

    constructor(props: any) {
        super(props);
        this.state = {
            isLoading: false,
            planets: [],
            filteredData: [],
            page: 1,
            isAnyPages: true,
            isTyping: false,
            searchParam: ''
        }
    }

    componentDidMount() {
        this.onRefresh();
        this.keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            this.keyboardDidShow,
        );
        this.keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            this.keyboardDidHide,
        );
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    private keyboardDidShow = () => {
        this.setState({
            isTyping: true
        })
    }

    private keyboardDidHide = () => {
        this.setState({
            isTyping: false
        })
    }

    private goToPlanetInfo = (link: string[], name: string) => {
        this.props.navigation.navigate('InhabitantsOfThePlanet', { link, name });
    }

    private filterData = (value: string) => {
        const newPlanets = this.state.planets.filter((item: Planet) => !(item.name.toLowerCase()).indexOf(value.toLowerCase()) || value === '');
        this.setState({
            filteredData: newPlanets,
            searchParam: value
        });
    }

    private getMorePlanets = () => {
        if (!this.onEndReachedCalledDuringMomentum && this.state.isAnyPages && !this.state.isLoading && !this.state.isTyping) {
            this.setState({
                isLoading: true,
            });
            PlanetService.getPlanets(this.state.page)
                .then(res => {
                    const newPlanets = [...this.state.planets, ...res.data.results];
                    this.setState({
                        isLoading: false,
                        planets: newPlanets,
                        filteredData: newPlanets,
                        page: res.data.next ? this.state.page + 1 : this.state.page,
                        isAnyPages: res.data.next ? true : false
                    });
                    this.filterData(this.state.searchParam);
                    this.onEndReachedCalledDuringMomentum = true;
                })
        }
    }

    private onRefresh = () => {
        this.setState({
            isLoading: true,
        });
        PlanetService.getPlanets(1)
            .then(res => {
                const newPlanets = [...res.data.results];
                this.setState({
                    isLoading: false,
                    planets: newPlanets,
                    filteredData: newPlanets,
                    page: 2
                });
                this.filterData(this.state.searchParam);
            });
    }

    private renderItem = ({ item, index }: { item: Planet, index: number }) => {
        const uri = +item.surface_water > 70 ? 'https://pluspng.com/img-png/planet-png-hd-ice1-png-2300.png' : +item.surface_water < 70 && +item.surface_water > 10 ? 'https://itvologda.ru/images/planet-png-hd-terran1-png-2200.png' : 'https://pngimg.com/uploads/mars_planet/mars_planet_PNG29.png';
        return <TouchableOpacity
            onPress={() => this.goToPlanetInfo(item.films, item.name)}
            style={styles.renderItem}>
            <Image style={styles.planetImg} source={{ uri }} />
            <Text style={styles.headerText}>
                {item.name}
            </Text>
            <Text style={styles.textColor}>Diametr: {item.diameter}</Text>
            <Text style={styles.textColor}>Gravity: {item.gravity}</Text>
            <Text style={styles.textColor}>Population: {item.population}</Text>
            <Text style={styles.textColor}>Terrain: {item.terrain}</Text>
            <Text style={styles.textColor}>Water surface: {item.surface_water}</Text>
        </TouchableOpacity>
    }

    private renderFooter = () => {
        return (
            this.state.isLoading ? <ActivityIndicator style={styles.activityIndicator} size="large" color="#fd2e45" /> : null
        )
    }

    private renderNoResultView = () => {
        return (
            this.state.filteredData.length < 1 && !this.state.isLoading ? <View style={styles.noResultsView}><Text style={styles.textColor}>no results</Text></View> : null
        )
    }

    render() {
        const { planets, isLoading, filteredData, isTyping } = this.state;
        const flatlistStyle = isTyping ? styles.mrBot72 : null
        return (
            <SafeAreaView
                forceInset={{ top: 'never', horizontal: 'never', bottom: 'always' }}
                style={styles.SafeAreaView}
            >
                <View
                    style={styles.search}
                >
                    <DelayInput
                        minLength={2}
                        placeholder={'Search for planet'}
                        onChangeText={(value) => this.filterData(value as string)}
                        delayTimeout={500}
                        style={styles.input}
                    />
                    <Image
                        style={styles.searchImage}
                        source={{ uri: 'https://img.icons8.com/material-rounded/50/f0f8ff/search.png' }}
                    />
                </View>
                {
                    isLoading && planets.length < 1 ? <Loader /> :
                        <KeyboardAvoidingView behavior='padding' style={styles.keyboardAvoidingView}>
                            <FlatList
                                style={flatlistStyle}
                                data={filteredData}
                                renderItem={this.renderItem}
                                keyExtractor={(item: Planet, index) => `${item.url} ${index}`}
                                onEndReached={this.getMorePlanets}
                                onMomentumScrollBegin={() => {
                                    this.onEndReachedCalledDuringMomentum = false
                                }}
                                scrollEventThrottle={1}
                                onEndReachedThreshold={0.2}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={isLoading}
                                        onRefresh={this.onRefresh}
                                        tintColor={'#fd2e45'}
                                        colors={['#fd2e45']}
                                    />
                                }
                                ListFooterComponent={this.renderFooter()}
                                ListEmptyComponent={this.renderNoResultView()}
                            />
                        </KeyboardAvoidingView>
                }
            </SafeAreaView>
        )
    }
}

export default PlanetList