import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Image } from 'react-native';
import { NavigationScreenProp, NavigationState, NavigationParams, SafeAreaView } from "react-navigation";
import { Inhabitant } from '../shared/models/inhabitant.model';
import AsyncStorage from '@react-native-community/async-storage';
import toggleFavorite from '../shared/helpers/toggleFavorite';
import { styles } from '../styles/profile.styles';

interface Props {
    navigation: NavigationScreenProp<NavigationState, NavigationParams>
};

interface State {
    favorites: Inhabitant[],
    item: Inhabitant
}

class ProfileInformation extends Component<Props, State> {
    static navigationOptions = ({ navigation }: NavigationParams) => {
        return {
            headerTitle: navigation.getParam('item').name,
        };
    };

    private backHandler: any;

    constructor(props: Props) {
        super(props);
        this.state = {
            favorites: [],
            item: this.props.navigation.getParam('item')
        }
    }

    componentDidMount() {
        AsyncStorage.getItem('favorites')
            .then(res => {
                if (res) {
                    this.setState({
                        favorites: JSON.parse(res)
                    })
                }
            })

        const { setParams } = this.props.navigation;
        setParams({ title: this.props.navigation.getParam('name') });
    }

    private toggleFavorite(item: Inhabitant, isExist: boolean) {
        toggleFavorite(item, isExist)
            .then(res => {
                this.setState({
                    favorites: res
                })
            })
    }

    render() {
        const { favorites, item } = this.state;
        const favImg = favorites.length > 0 && favorites.filter((favorite: Inhabitant) => item.url === favorite.url).length > 0 ? 'https://img.icons8.com/material/40/fd2e45/like--v1.png' : 'https://img.icons8.com/material/40/aaaaaa/like--v1.png';
        const uri = item.gender === 'male' ? 'https://img.icons8.com/ios/1000/000000/standing-man.png' : item.gender === 'female' ? 'https://img.icons8.com/ios/1000/000000/standing-woman.png' : 'https://img.icons8.com/ios/1000/000000/question-mark.png';
        const backgroundColor = item.gender === 'male' ? 'royalblue' : item.gender === 'female' ? 'pink' : 'purple';
        return (
            <SafeAreaView
                forceInset={{ top: 'never', horizontal: 'never', bottom: 'always' }}
                style={styles.safeAreaView}
            >
                <View
                    style={styles.infoCard}>
                    <TouchableOpacity
                        onPress={() => this.toggleFavorite(item, favorites.filter((favorite: Inhabitant) => item.url === favorite.url).length > 0)}
                        style={styles.inhabitantImgTouchable}
                    >
                        <Image style={styles.inhabitantImg} source={{ uri: favImg }} />
                    </TouchableOpacity>
                    <Image style={[styles.personImage, { backgroundColor }]} source={{ uri }} />
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
                    <Text style={styles.textColor}>
                        Skin color: {item.skin_color}
                    </Text>
                    <Text style={styles.textColor}>
                        Hair color: {item.hair_color}
                    </Text>
                </View>
            </SafeAreaView>
        )
    }
}

export default ProfileInformation;