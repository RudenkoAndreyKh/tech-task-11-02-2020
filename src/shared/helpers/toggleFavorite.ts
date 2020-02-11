import { Inhabitant } from "../models/inhabitant.model";
import AsyncStorage from "@react-native-community/async-storage";

export default async function toggleFavorite(item: Inhabitant, isExist: boolean): Promise<Inhabitant[]> {
    let newFavorites: Inhabitant[] = [];
    await AsyncStorage.getItem('favorites')
        .then(res => {
            const favorites = res !== null ? JSON.parse(res) : [];
            favorites !== null && favorites.length > 0 ? favorites.map((fav: Inhabitant) => {
                fav.url !== item.url ? newFavorites.push(fav) : null;
            }) : null;

            !isExist ? newFavorites.push(item) : null;

            AsyncStorage.setItem('favorites', (JSON.stringify(newFavorites)));
        });
    return newFavorites;
}