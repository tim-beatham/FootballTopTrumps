import React from 'react'
import { StyleSheet, Text, View, StatusBar, TouchableOpacity} from 'react-native';
import {colourPalette, Styles} from "../Stylesheet"
import { color } from 'react-native-reanimated';

class Home extends React.Component {

    render() {
        return (
            <View style={Styles.container}>
                <StatusBar backgroundColor={"#38003C"} barStyle="light-content" />
                <View style={Styles.titleBanner}>
                    <Text style={Styles.titleText}>Football Top Trumps</Text>
                </View>
                <View style={homeStyle.buttonContainer}>
                    <TouchableOpacity style={[Styles.buttonTemplate, homeStyle.createContainer]}>
                        <Text style={Styles.buttonText}>Create Game</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[Styles.buttonTemplate, homeStyle.joinContainer]}>
                        <Text style={Styles.buttonText}>Join Game</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[Styles.buttonTemplate, homeStyle.newDeckContainer]}
                    onPress={() => this.props.navigation.navigate('Deck')}>
                        <Text style={Styles.buttonText}>Decks</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const homeStyle = StyleSheet.create({
    buttonContainer: {
      flex: 10,
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'stretch',
      justifyContent: 'center'
    },
    createContainer: {
      height: '30%',
      width: '40%',
      backgroundColor: colourPalette.blue,
    },
    joinContainer: {
      height: '30%',
      width: '40%',
      backgroundColor: colourPalette.red,
    },
    newDeckContainer: {
      width: '70%',
      height: '60%',
      backgroundColor: colourPalette.green,
    }
  });
  

export {Home}