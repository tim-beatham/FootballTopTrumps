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
                userID: this.uniqueID})
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

    popCard = () => {
        this.setState({cards: this.state.cards.slice(1)})
    }     
    
    addCard = (cardID) => {
        this.setState({cards: [...this.state.cards, cardID]})
    }

    renderWidgets = () => {
        if (this.state.cards.length > 0) {
            return (
                <Card cards={this.state.cards} socket={this.socket} 
                            gameID={this.gameID} userID={this.uniqueID}
                            popCard={this.popCard} addCard={this.addCard} />
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
            currentPlayer: undefined
        }

        this.events()

    }

    events = () => {
        this.props.socket.on("requestCards", (winner) => {
            this.props.socket.emit("sendCardToWinner", 
                        {cardID:this.state.currentPlayer.id, gameID: this.props.gameID,
                            winner: winner})
            this.props.popCard()
            this.getNextCard()
        })

        this.props.socket.on("addCard", (info) => {
            console.log("Checking singular", info.cardID)
            if (this.props.userID === info.winner)
                this.props.addCard(info.cardID)
        })

    }

    wonRound = () => {
        console.log("Cards:", this.props.cards.length)
        this.props.socket.emit("wonRound", {id: this.props.userID,
                                    winner: this.props.userID})
    }

    getNextCard = () => {
        axios.get(REST_ENDPOINT + "/players/" + this.props.cards[0])
            .then(response => {
                this.setState({currentPlayer: response.data})
            })        
    }

    componentDidMount = () => {
        this.getNextCard()
    }

    renderPlayer = () => {
        if (this.state.currentPlayer !== undefined) {
            return (
                <View style={cardStyle.cardContainer}>
                    <Image style={{width:300, height:300}} source={{uri: this.state.currentPlayer.imageURL}}/>
                    <View style={cardStyle.metaInfo}>
                        <Text style={cardStyle.cardText}>Name: {this.state.currentPlayer.name}</Text>
                        <Text style={cardStyle.cardText}>Club: {this.state.currentPlayer.team}</Text>
                        <Text style={cardStyle.cardText}>Division: {this.state.currentPlayer.division}</Text>
                        <Text style={cardStyle.cardText}>Position: {this.state.currentPlayer.position}</Text>
                    </View>
                    <View style={cardStyle.keyInfo}>
                        <Text style={cardStyle.cardText}>Goals: {this.state.currentPlayer.goals}</Text>
                        <Text style={cardStyle.cardText}>Assists: {this.state.currentPlayer.assists}</Text>
                        <Text style={cardStyle.cardText}>Yellow Cards: {this.state.currentPlayer.yellowCards}</Text>
                        <Text style={cardStyle.cardText}>Red Cards: {this.state.currentPlayer.redCards}</Text>
                        <Text style={cardStyle.cardText}>Minutes Played: {this.state.currentPlayer.minsPlayed}</Text>
                        <Text style={cardStyle.cardText}>Starts: {this.state.currentPlayer.starts}</Text>
                    </View>
                    <TouchableOpacity style={[Styles.buttonTemplate, cardStyle.wonButton]} onPress={this.wonRound}>
                        <Text style={Styles.buttonText}>I Won</Text>
                    </TouchableOpacity>
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
        flexDirection: 'column'
    },
    metaInfo: {
        backgroundColor: 'orange'
    },
    keyInfo: {
        backgroundColor: 'green'
    },
    cardText: {
        color: 'white',
        fontSize: 10
    },
    wonButton: {
        backgroundColor: colourPalette.purple,
    }
})

export default GameLobby