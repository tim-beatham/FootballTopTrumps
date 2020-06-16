import { StyleSheet } from 'react-native';

const colourPalette = {
    purple: '#38003c',
    blue: '#04F5FF',
    red:  '#E90052',
    green: '#00FF85'
}

const Styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    },
    titleText: {
        padding: 5,
        fontSize: 40,
        color: 'white',
        textAlign: 'center'
    },
    titleBanner: {
        flex: 2,
        backgroundColor: colourPalette.purple
    },
    buttonText: {
        fontSize: 25,
        color: 'white',
        alignSelf: "center"
    },
    buttonTemplate: {
        borderRadius: 15,
        margin: 10,
        justifyContent: 'center',
        textAlign: 'center'
    }
})

export {colourPalette, Styles};