import React from "react"
import {colourPalette, Styles} from '../Stylesheet'
import {Text, TextInput, View} from 'react-native'
import socketIOClient from 'socket.io-client'

const ENDPOINT = "http://81.154.167.160:3000"


export default class JoinGame extends React.Component {

    constructor(props) {
        super(props)
        this.socket = socketIOClient(ENDPOINT)

        this.state = {
            serverFull : false,
            noServer : false,
            serverID: ""
        }
    }

    joinGame = (obj) => {
        this.setState({serverID: obj.nativeEvent.text})

        // Check if the server exists, and if the server
        // is not full.

        this.socket.emit('checkJoin', obj.nativeEvent.text)

        this.socket.on('noServer', () => {
            this.setState({serverFull: false})
            this.setState({noServer: true})
        })

        this.socket.on('serverFull', () => {
            console.log("The Server is Full")
            this.setState({serverFull: true})
            this.setState({noServer: false})
        })        
        
        this.socket.on('okToJoin', () => {
            this.props.navigation.navigate("GameLobby", {gameID: this.state.serverID,
                                                        createGame: false})
        })

    }

    componentWillUnmount = () => {
        this.setState({serverFull: false})
        this.setState({noServer: false})
    }

    drawResponse = () => {
        if (this.state.serverFull) {
            return (
                <Text>The Server specified is full</Text>
            )
        } else if (this.state.noServer) {
            return (
                <Text>The Server specified does not exist</Text>
            )
        }
    }

    render = () => {
        return (
            <View style={Styles.container}>
                <TextInput placeholder={"Game ID"} onSubmitEditing={this.joinGame}/>
                <Text>{() => {this.state.serverFull ? "The Server specified is full" : ""}}</Text>
                <Text>{() => {this.state.noServer ? "The Server you specified does not exist" : ""}}</Text>
                {this.drawResponse()}
            </View>
        )
    }
}
