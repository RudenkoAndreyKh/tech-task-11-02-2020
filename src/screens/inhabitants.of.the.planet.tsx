import React, { Component } from 'react';
import { FlatList, Text, View, KeyboardAvoidingView, TouchableOpacity, Image, Keyboard } from 'react-native';
import Loader from '../shared/components/loader';
import DelayInput from "react-native-debounce-input";
import { NavigationScreenProp, NavigationState, NavigationParams, SafeAreaView } from "react-navigation";
import PlanetService from '../services/planet.service';
import planetService from '../services/planet.service';
import { Inhabitant } from '../shared/models/inhabitant.model';
import AsyncStorage from '@react-native-community/async-storage';
import toggleFavorite from '../shared/helpers/toggleFavorite';
import {styles} from '../styles/inhabitants.styles';

interface Props {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>
};

interface State {
    links: string[],
    inhabitant: Inhabitant[],
    filteredData: Inhabitant[],
    isLoading: boolean,
    charactersCount: number,
    searchParam: string,
    isTyping: boolean,
    favorites: Inhabitant[]
}

class InhabitantsOfThePlanet extends Component<Props, State> {
    static navigationOptions = ({ navigation }: NavigationParams) => {
        return {
            headerTitle: navigation.getParam('name', 'Planet'),
        };
    };

    private keyboardDidShowListener: any;
    private keyboardDidHideListener: any;
    private focusPage: any;

    constructor(props: Props) {
        super(props);
        this.state = {
            links: this.props.navigation.getParam('link'),
            inhabitant: [],
            filteredData: [],
            isLoading: false,
            charactersCount: 0,
            searchParam: '',
            isTyping: false,
            favorites: []
        }
    }

    componentDidMount() {
        this.focusPage = this.props.navigation.addListener(
            'didFocus',
            () => {
                AsyncStorage.getItem('favorites')
                    .then(res => {
                        if (res) {
                            this.setState({
                                favorites: JSON.parse(res)
                            })
                        }
                    })
            }
        );
        const { setParams } = this.props.navigation;
        setParams({ title: this.props.navigation.getParam('name') })
        this.getInhabitants();
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
        this.focusPage.remove();
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

    private filterData = (value: string) => {
        const newPlanets = this.state.inhabitant.filter((item: Inhabitant) => !(item.name.toLowerCase()).indexOf(value.toLowerCase()) || value === '');
        this.setState({
            filteredData: newPlanets,
            searchParam: value
        });
    }

    private getInhabitants = () => {
        this.setState({
            isLoading: true
        });
        // Тут происходит чертовщина, ибо при запросе фильма, выдает объект с массивом ссылок на персонажей, а не объекты самих прсонажей =)
        this.state.links.forEach((item: string) => {
            PlanetService.getFilm(item)
                .then(res => {
                    this.setState({
                        charactersCount: this.state.charactersCount + res.data.characters.length
                    })
                    res.data.characters.forEach((link: string) => {
                        planetService.getInhabitants(link)
                            .then(res => {
                                const newData: Inhabitant[] = this.state.inhabitant;

                                newData.push(res.data);
                                this.setState({
                                    inhabitant: newData,
                                    filteredData: newData,
                                    isLoading: false
                                });
                            })
                    });
                })
        });
    }

    private toggleFavorite(item: Inhabitant, isExist: boolean) {
        toggleFavorite(item, isExist)
            .then(res => {
                this.setState({
                    favorites: res
                })
            })
    }

    private goToProfile(item: Inhabitant) {
        this.props.navigation.navigate('ProfileInformation', { item });
    }

    private renderItem = ({ item, index }: { item: Inhabitant, index: number }) => {
        const { favorites } = this.state;
        const favImg = favorites.length > 0 && favorites.filter((favorite: Inhabitant) => item.url === favorite.url).length > 0 ? 'https://img.icons8.com/material/40/fd2e45/like--v1.png' : 'https://img.icons8.com/material/40/aaaaaa/like--v1.png';
        const uri = item.gender === 'male' ? 'https://img.icons8.com/ios/1000/000000/standing-man.png' : item.gender === 'female' ? 'https://img.icons8.com/ios/1000/000000/standing-woman.png' : 'https://img.icons8.com/ios/1000/000000/question-mark.png';
        const imageBackColor = item.gender === 'male' ? 'royalblue' : item.gender === 'female' ? 'pink' : 'purple';

        return <TouchableOpacity
            onPress={() => this.goToProfile(item)}
            style={styles.renderItem}>
            <TouchableOpacity
                onPress={() => this.toggleFavorite(item, favorites.filter((favorite: Inhabitant) => item.url === favorite.url).length > 0)}
                style={styles.inhabitantImgTouchable}
            >
                <Image style={styles.inhabitantImg} source={{ uri: favImg }} />
            </TouchableOpacity>
            <Image style={[styles.personImage, { backgroundColor: imageBackColor }]} source={{ uri }} />
            <Text style={styles.headerText}>
                {item.name}
            </Text>
            <Text style={styles.textColor}>
                {item.gender}
            </Text>
            <Text style={styles.textColor}>
                Height: {item.height}
            </Text>
            <Text style={styles.textColor}>
                Mass: {item.mass}
            </Text>
            <Text style={styles.textColor}>
                Birthday: {item.birth_year}
            </Text>
        </TouchableOpacity>
    }

    private renderNoResultView = () => {
        return (
            this.state.filteredData.length < 1 && !this.state.isLoading ? <View style={styles.noResults}><Text style={styles.textColor}>no results</Text></View> : null
        )
    }

    render() {
        const { filteredData, isLoading, isTyping } = this.state;
        const flatlistStyle = isTyping ? styles.mrBot72 : null

        return (
            <SafeAreaView
                forceInset={{ top: 'never', horizontal: 'never', bottom: 'always' }}
                style={styles.safeAreaView}
            >
                <View
                    style={styles.search}
                >
                    <DelayInput
                        minLength={2}
                        placeholder={'Search for inhabitant'}
                        onChangeText={(value) => this.filterData(value as string)}
                        delayTimeout={500}
                        style={styles.input}
                    />
                    <Image
                        style={styles.inputImg}
                        source={{ uri: 'https://img.icons8.com/material-rounded/50/f0f8ff/search.png' }}
                    />
                </View>
                {isLoading && filteredData.length < 1 ? <Loader /> : <KeyboardAvoidingView behavior='padding' style={styles.keboardAvoidingView}>
                    <FlatList
                        style={flatlistStyle}
                        data={filteredData}
                        renderItem={this.renderItem}
                        keyExtractor={(item: Inhabitant, index) => `${item.name} ${index}`}
                        scrollEventThrottle={1}
                        onEndReachedThreshold={1}
                        ListEmptyComponent={this.renderNoResultView()}
                    />
                </KeyboardAvoidingView>}
            </SafeAreaView>
        )
    }
}

export default InhabitantsOfThePlanet