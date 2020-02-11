import React, { Component, } from 'react';
import { FlatList, Text, View, TouchableOpacity, Image } from 'react-native';
import { NavigationScreenProp, NavigationState, NavigationParams, SafeAreaView } from "react-navigation";
import AsyncStorage from '@react-native-community/async-storage';
import { Inhabitant } from '../shared/models/inhabitant.model';
import toggleFavorite from '../shared/helpers/toggleFavorite';
import {styles} from '../styles/favorites.styles';

interface Props {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>
};

interface State {
    favorites: Inhabitant[]
}

class Favorites extends Component<Props, State> {
    static navigationOptions = ({ navigation }: NavigationParams) => {
        return {
            headerTitle: 'Favorites',
        };
    };

    private focusPage: any;

    constructor(props: Props) {
        super(props);
        this.state = {
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
    }

    componentWillUnmount() {
        this.focusPage.remove();
    }

    private toggleFavorite(item: Inhabitant, isExist: boolean) {
        toggleFavorite(item, isExist)
            .then(res => {
                this.setState({
                    favorites: res
                })
            });
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
            this.state.favorites.length < 1 ? <View style={styles.noResults}><Text style={styles.textColor}>no results</Text></View> : null
        )
    }

    render() {
        const { favorites } = this.state;

        return (
            <SafeAreaView
                forceInset={{ top: 'never', horizontal: 'never', bottom: 'always' }}
                style={styles.safeAreaView}
            >
                <FlatList
                    data={favorites}
                    renderItem={this.renderItem}
                    keyExtractor={(item: Inhabitant, index) => `${item.name} ${index}`}
                    scrollEventThrottle={1}
                    onEndReachedThreshold={1}
                    ListEmptyComponent={this.renderNoResultView()}
                />
            </SafeAreaView>
        )
    }
}

export default Favorites