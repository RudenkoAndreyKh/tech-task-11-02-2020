import { StyleSheet, Dimensions } from 'react-native';

const deviceWidth = Dimensions.get('screen').width;

export const styles = StyleSheet.create({
    safeAreaView: { flex: 1, backgroundColor: '#181E26' },
    search: { borderBottomWidth: 1, borderBottomColor: '#3B3935', justifyContent: 'center' },
    input: {
        margin: 10, height: 40, borderColor: '#3B3935', borderWidth: 1, borderRadius: 10, backgroundColor: '#3B3935', paddingHorizontal: 10
    },
    inputImg: {
        width: 24,
        height: 24,
        position: 'absolute',
        right: 20
    },
    keboardAvoidingView: { flex: 1 },
    mrBot72: {
        marginBottom: 72,
    },
    renderItem: {
        margin: 15,
        padding: 15,
        borderColor: '#3B3935',
        borderWidth: 1,
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
        width: deviceWidth - 60,
        height: deviceWidth - 60,
    },
    headerText: { color: 'aliceblue', fontWeight: 'bold', fontSize: 24 },
    textColor: { color: 'aliceblue' },
    noResults: { marginTop: 24, alignItems: 'center' }
})