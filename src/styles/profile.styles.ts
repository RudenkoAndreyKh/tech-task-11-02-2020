import { StyleSheet, Dimensions } from 'react-native';

const deviceWidth = Dimensions.get('screen').width;

export const styles = StyleSheet.create({
    safeAreaView: { flex: 1, backgroundColor: '#181E26' },
    infoCard: {
        padding: 15,
        backgroundColor: '#17141C'
    },
    inhabitantImgTouchable: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 1,
        opacity: 0.5
    },
    inhabitantImg: {
        width: 40,
        height: 40,
    },
    personImage: {
        width: deviceWidth - 30,
        height: deviceWidth - 30,
    },
    headerText: { color: 'aliceblue', fontWeight: 'bold', fontSize: 24 },
    textColor: { color: 'aliceblue' },
    noResults: { marginTop: 24, alignItems: 'center' }
})