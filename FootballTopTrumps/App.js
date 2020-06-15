import 'react-native-gesture-handler'
import React from 'react';
import { NavigationContainer, StackActions } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { StyleSheet, Text, View, Button, StatusBar, TouchableOpacity } from 'react-native';

const Stack = createStackNavigator()

class App extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor={"#00FF85"} barStyle="light-content" />
        <View style={styles.titleBanner}>
          <Text style={styles.titleText}>Football Top Trumps</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.createContainer}>
            <Text style={styles.buttonText}>Create Game</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.joinContainer}>
            <Text style={styles.buttonText}>Join Game</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.newDeckContainer}>
            <Text style={styles.buttonText}>New Deck</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

}

export default App

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center'
  },
  titleText: {
    padding: 5,
    fontSize: 40,
    backgroundColor: '#00FF85',
    color: 'white',
    textAlign: 'center'
  },
  titleBanner: {
    flex:2
  },
  buttonText: {
    fontSize: 30,
    color: 'white'
  },
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
    padding: 15,
    margin: 10,
    borderRadius: 15,
    backgroundColor: "#04F5FF",
    justifyContent: "center",
  },
  joinContainer: {
    height: '30%',
    width: '40%',
    borderRadius: 15,
    padding: 15,
    margin: 10,
    backgroundColor: "#E90052",
    justifyContent: "center"
  },
  newDeckContainer: {
    width: '70%',
    height: '60%',
    borderRadius: 15,
    padding: 15,
    margin: 10,
    backgroundColor: "#38003C",
    justifyContent: "center"
  }
});
