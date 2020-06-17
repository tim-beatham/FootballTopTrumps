import 'react-native-gesture-handler'
import React from 'react';
import { NavigationContainer, StackActions } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { StyleSheet, Text, View, Button, StatusBar, TouchableOpacity } from 'react-native';
import {colourPalette, Styles} from './Stylesheet.js'
import {Home} from './components/Home.js'
import {Deck, NewDeck, Results, ViewDecks, ViewDeckScreen} from './components/Deck.js'
import { ScreenStack } from 'react-native-screens'

const Stack = createStackNavigator()

class App extends React.Component {

  constructor() {
    super()
  }

  setQueryOptions = (str) => {
    this.setState({queryOptions: str})
  }

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator screenOptions={{
          headerShown: false
        }}>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Deck" component={Deck} />
          <Stack.Screen name="New Deck" component={NewDeck} />
          <Stack.Screen name="Results" component={Results} />
          <Stack.Screen name="View Decks" component={ViewDecks} />
          <Stack.Screen name="View Deck Screen" component={ViewDeckScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

}

export default App

