import React from "react"
import {colourPalette, Styles} from '../Stylesheet'
import {Text, TouchableOpacity, View, StyleSheet, Image} from 'react-native'
import QRCode from 'react-native-qrcode-svg'
import axios from 'axios'
import socketIOClient from 'socket.io-client'

const ENDPOINT = "http://81.154.167.160:3000"

const REST_ENDPOINT = "http://81.154.167.160:8080/api/v1/"



class GameLobby extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            createGame: this.props.route.params.createGame,
            gameID: "",
            numPlayers: 0,
            started: false,
            hideLobby: false,
            cards: []
        }                        

        if (!this.state.createGame) {
            this.gameID = this.props.route.params.gameID
        } else {
            this.deck = this.props.route.params.deck
        }

        this.socket = socketIOClient(ENDPOINT)
        this.uniqueID = this.guuidGenerator()

        this.setUpServer()
    }

    // Generates a unique ID for the client.
    guuidGenerator = () => {
        var S4 = function() {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
         };
         return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    }

    drawStartButton = () => {
        if (this.state.createGame && !this.state.started) {
            return (
                <TouchableOpacity style={[Styles.buttonTemplate, gameLobbyStyle.playButton]} onPress={this.startGame}>
                    <Text style={Styles.buttonText}>Start</Text>
                </TouchableOpacity>
            )
        }
    }

    startGame = () => {
        this.socket.emit("gameStarted", {deck: this.deck, gameID: this.gameID})
        this.setState({started: true})
    }

    componentWillUnmount = () => {
        // Disconnect all users from the server.
        if (this.state.createGame) {
            this.socket.emit("hostDisconnected", {gameID: this.gameID, userID: this.uniqueID})
            
        } else {
            this.socket.emit("clientDisconnecting", {gameID: this.gameID, 
                userID: this.userID})
        }
        this.socket.disconnect()
    }

    setUpServer = () => {
        if (this.state.createGame){

            this.socket.emit('createGame', this.uniqueID)

            this.socket.on('gameCreated', (id) => {
                this.gameID = id
            })
        } else {
            // TODO : Joining game logic.
            // Join the server.
            this.socket.emit('joinGame', {gameID: this.gameID, userID: this.uniqueID})
            
        }

        this.socket.on("playersChanged", (numPlayers) => {
            this.setState({numPlayers: numPlayers})
        })

        this.socket.on('forceDisconnect', () => {
            this.props.navigation.navigate('JoinGame')
        })

        this.socket.on("startGame", () => {
            this.socket.emit("requestCards", {gameID: this.gameID})
            this.setState({hideLobby: true})
        })

        this.socket.on("sendCards", (playerCards) => {
            
            this.setState({cards: playerCards})
            this.setState({hideLobby: true})
        })
    }

    renderWidgets = () => {
        if (this.state.cards.length > 0) {
            return (
                <Card cards={this.state.cards} />
            )
        } else {
            return (
                <View style={Styles.container}>
                    <Text>{this.gameID}</Text>       
                    <Text>{this.state.numPlayers} players connected!</Text>    
                    <Text>Welcome to the game lobby</Text>
                    {this.drawStartButton()}
                </View>
            )
        }
    }

    render() {
        return (
            <View style={Styles.container}>
                {this.renderWidgets()}
            </View>
        )
    }

}

const gameLobbyStyle = StyleSheet.create({
    playButton: {
        backgroundColor: colourPalette.green,
        margin: 40,
        width: 150,
        height: 50
    }
})


class Card extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            playersObjs: [],
            cardsLeft: this.props.cards.length,
            currentPlayer: undefined
        }

    }

    componentDidMount = () => {
        for (let playerID of this.props.cards) {
            axios.get(REST_ENDPOINT + "/players/" + playerID)
                .then(response => {
                    this.setState({playersObjs: [...this.state.playersObjs, response.data]})
                })
        }

        axios.get(REST_ENDPOINT + "/players/" + this.props.cards[0])
            .then(response => {
                this.setState({currentPlayer: response.data})
            })        
    }

    renderPlayer = () => {
        if (this.state.currentPlayer !== undefined) {
            console.log(this.state.currentPlayer)
            return (
                <View style={cardStyle.cardContainer}>
                    <Image style={{width:200, height:200}} source={{uri: this.state.currentPlayer.imageURL}}/>
                </View>
            )
        }
    }


    render () {
        return (
            <View>
                {this.renderPlayer()}
            </View>
        )
    }
}

let cardStyle = StyleSheet.create({
    cardContainer: {
        width: '80%',
        height: '90%',
        backgroundColor: 'yellow',
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default GameLobby