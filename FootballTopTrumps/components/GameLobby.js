import React from "react"
import {colourPalette, Styles} from '../Stylesheet'
import {Text, TouchableOpacity, View, StyleSheet, Image} from 'react-native'
import QRCode from 'react-native-qrcode-svg'
import axios from 'axios'
import socketIOClient from 'socket.io-client'
import {ENDPOINT as REST_ENDPOINT, SOCKET_ENDPOINT as ENDPOINT} from '../server-info/ServerInfo'



class GameLobby extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            createGame: this.props.route.params.createGame,
            gameID: "",
            numPlayers: 0,
            hideLobby: false,
            cards: [],
            deckSize: -1,
            eliminated: false,
            wonGame: false,
            serverDown: false,
            connectionSuccess: false
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
        if (this.state.createGame && !this.state.hideLobby) {
            return (
                <TouchableOpacity style={[Styles.buttonTemplate, gameLobbyStyle.playButton]} onPress={this.startGame}>
                    <Text style={Styles.buttonText}>Start</Text>
                </TouchableOpacity>
            )
        }
    }

    startGame = () => {
        if (this.state.numPlayers > 1){
            this.socket.emit("gameStarted", {deck: this.deck, gameID: this.gameID})
            this.setState({deckSize: this.deck.players.length})
        }
    }

    componentWillUnmount = () => {
        // Disconnect all users from the server.
        if (this.state.createGame) {
            this.socket.emit("hostDisconnected", {gameID: this.gameID, userID: this.uniqueID})
            
        } else {
            this.socket.emit("clientDisconnecting", {gameID: this.gameID, 
                userID: this.uniqueID, isEliminated: this.state.eliminated})
            console.log("Eliminated", this.state.eliminated)

        }
        this.socket.disconnect()
    }

    setUpServer = () => {

        this.socket.emit("checkServer")

        this.socket.on("connectionSuccessful", () => {
            this.setState({connectionSuccess: true})
        })

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

        this.socket.on("showLobby", () => {
            this.setState({eliminated: false})
            this.setState({wonGame: false})
            this.setState({cards: []})
            this.setState({hideLobby: false})
            this.setState({deckSize: -1})
        })

        this.socket.on("playersChanged", (numPlayers) => {
            this.setState({numPlayers: numPlayers})


        })

        this.socket.on('forceDisconnect', () => {
            this.props.navigation.navigate('JoinGame')       
        })

        this.socket.on("startGame", (deckSize) => {
            this.socket.emit("requestCards", {gameID: this.gameID})
            this.setState({hideLobby: true})

            console.log("Testing receive", deckSize)

            this.setState({deckSize: deckSize})
            
        })

        this.socket.on("sendCards", (playerCards) => {
            
            this.setState({cards: playerCards})
            this.setState({hideLobby: true})
        })

        this.socket.on("disconnect", () => {
            this.setState({serverDown: true})
        })
    }

    popCard = () => {
        this.setState({cards: this.state.cards.slice(1)})
    }     
    
    addCard = (cardID) => {
        this.setState({cards: [...this.state.cards, cardID]})
    }

    setEliminated = () => {
        if (this.state.cards.length === 0)
            this.setState({eliminated: true})
    }

    setWonGame = () => {
        this.setState({wonGame: true})
    }

    hasWonGame = () => {
        if (this.state.cards.length === this.state.deckSize)
            return true
        return false
    }

    renderWidgets = () => {
        console.log("Cards", this.state.cards.length)
        console.log("DeckSize", this.state.deckSize)

        if (!this.state.connectionSuccess) {
            return (
                <View style={Styles.container}>
                    <Text>Attempting to connect to the server.</Text>
                    <Text>If this message does not disappear in 10 seconds</Text>
                    <Text>please try again.</Text>
                </View>
            )
        }else if (this.state.serverDown) {
            return (
                <Text>I am afraid the server has gone down.</Text>
            )        
        }else if (this.state.wonGame) {
            return (
                <Text>You have won the game!</Text>
            )
        } else if (this.state.cards.length > 0) {
            return (
                <Card cards={this.state.cards} socket={this.socket} 
                            gameID={this.gameID} userID={this.uniqueID}
                            popCard={this.popCard} addCard={this.addCard} 
                            setEliminated={this.setEliminated} 
                            setWonGame={this.setWonGame} 
                            hasWonGame={this.hasWonGame} />
            )
        } else if (this.state.eliminated){        
            return (
                <View style={Styles.container}>
                    <Text>I am afraid you have been eliminated.</Text>
                </View>
            )
        } else {
            return (
                <View style={Styles.container}>
                    <Text>{this.gameID}</Text>       
                    <Text>{this.state.numPlayers} player(s) connected!</Text>
                    <Text>There must be at least two players to start the game.</Text>    
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
            if (this.props.cards.length !== 0) {
                this.props.socket.emit("sendCardToWinner", 
                            {cardID:this.state.currentPlayer.id, gameID: this.props.gameID,
                                winner: winner})
                this.props.popCard()
                this.getNextCard()

                this.props.setEliminated()
            } 
        })

        this.props.socket.on("addCard", (info) => {
            console.log("Checking singular", info.cardID)
            if (this.props.userID === info.winner) {
                this.props.addCard(info.cardID)
            }
            
            if (this.props.hasWonGame()) {
                this.props.setWonGame()
            }

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
        backgroundColor: 'white',
        flexDirection: 'column',
        flex: 1
    },
    metaInfo: {
        backgroundColor: '#1C5F88'
    },
    keyInfo: {
        backgroundColor: colourPalette.red
    },
    cardText: {
        color: 'white',
        fontSize: 20
    },
    wonButton: {
        backgroundColor: colourPalette.purple,
    }
})

export default GameLobby