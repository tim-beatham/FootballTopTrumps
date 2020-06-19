import React from "react"
import {colourPalette, Styles} from '../Stylesheet'
import {Text, TextInput, View} from 'react-native'
import socketIOClient from 'socket.io-client'
import {SOCKET_ENDPOINT as ENDPOINT} from '../server-info/ServerInfo'


export default class JoinGame extends React.Component {

    constructor(props) {
        super(props)
        this.socket = socketIOClient(ENDPOINT)

        this.state = {
            serverFull : false,
            noServer : false,
            gameStarted: false,
            serverID: ""
        }
    }

    joinGame = (obj) => {
        this.setState({serverID: obj.nativeEvent.text})

        // Check if the server exists, and if the server
        // is not full.

        this.socket.emit('checkJoin', obj.nativeEvent.text)

        this.setState({serverFull: false})
        this.setState({noServer: false})
        this.setState({gameStarted: false})

        this.socket.on('noServer', () => {
            this.setState({noServer: true})
        })

        this.socket.on('serverFull', () => {
            console.log("The Server is Full")
            this.setState({serverFull: true})
        })        

        this.socket.on('gameAlreadyStarted', () => {
            this.setState({gameStarted: true})
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
        } else if (this.state.gameStarted) {
            return (
                <Text>The game has already started!</Text>
            )
        } else {
            return (
                <Text></Text>
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
