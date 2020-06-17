import React from "react"
import {colourPalette, Styles} from '../Stylesheet'
import {Text, TextInput, View} from 'react-native'


export default class JoinGame extends React.Component {

    constructor(props) {
        super(props)
    }

    joinGame = (obj) => {
        console.log(obj)

        let serverID = obj.nativeEvent.text

        console.log("ServerID", serverID)
        
        this.props.navigation.navigate("GameLobby", {gameID: serverID,
                                                    createGame: false})
    }

    render () {
        return (
            <View style={Styles.container}>
                <TextInput placeholder={"Game ID"} onSubmitEditing={this.joinGame}/>
            </View>
        )
    }
}
