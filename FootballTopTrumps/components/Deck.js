import React from 'react'
import {colourPalette, Styles} from '../Stylesheet'
import {Text, TouchableOpacity, View, StyleSheet, ScrollView, Image} from 'react-native'
import { Dropdown } from 'react-native-material-dropdown'
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import axios from 'axios'
import { render } from 'react-dom'

class Deck extends React.Component {

    

    render () {
        return (
            <View style={Styles.container}>
                <TouchableOpacity style={[deckStyle.newDeckButton ,Styles.buttonTemplate]}
                onPress={() => this.props.navigation.navigate("New Deck")}>
                    <Text style={Styles.buttonText}>New Deck</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[deckStyle.viewDeckButton, Styles.buttonTemplate]} >
                    <Text style={Styles.buttonText}>View Decks</Text>
                </TouchableOpacity>
                
            </View>
        )
    }
}

const startLeague = "Championship"
const startPos = "MF"
const startGoals = [-1, 40]
const startAssists = [-1, 40]
const startReds = [-1, 40]
const startYellows = [-1, 40]
const startStarts = [-1, 1000]
const startPlayed = [-1, 4000]


class NewDeck extends React.Component {

    constructor() {
        super()
        this.state = {
            league: startLeague,
            position: startPos,
            goals: [startGoals[0], startGoals[1]],
            assists: [startAssists[0], startAssists[1]],
            redCards: [startReds[0], startReds[1]],
            yellowCards: [startYellows[0], startYellows[1]],
            starts: [startStarts[0], startStarts[1]],
            minsPlayed: [startPlayed[0], startPlayed[1]],
            selectedCards: []     
        }
    }

    addSelectedCard = (cardID) => {
        console.log(cardID)
        if (this.state.selectedCards.find((element) => element === cardID) === undefined) {
            this.setState({selectedCards: [...this.state.selectedCards, cardID]})
        }
        console.log("Add:", this.state.selectedCards)
    }

    deleteSelectedCard = (cardID) => {
        if (this.state.selectedCards.find((element) => element === cardID) !== undefined) {
            let tempList = this.state.selectedCards
            tempList.splice(tempList.findIndex((element) => element === cardID), 1)
            this.setState({selectedCards: tempList})
        }
        console.log("Remove:", this.state.selectedCards)
    }

    selectedCardsMsg = () => {

        return (
         <Text>You have selected {this.state.selectedCards.length} cards!</Text>
        )

    }


    onLeagueChange = (data) => {
        this.setState({league: data})
    }

    onPositionChange = (data) => {
        console.log("position changed")
        this.setState({position: data})
    }

    onAssistsChange = (data) => {
        console.log(data)
        this.setState({assists: [data[0] - 1, data[1] + 1]})
    }

    onGoalsChange = (data) => {
        this.setState({goals: [data[0] - 1, data[1] + 1]})
    }

    onRedCardChange = (data) => {
        this.setState({redCards: [data[0] - 1, data[1] + 1]})
    }

    onYellowCardChange = (data) => {
        this.setState({yellowCards: [data[0]- 1, data[1] + 1]})
    }

    onMinsChange = (data) => {
        this.setState({minsPlayed: [data[0] - 1, data[1] + 1]})
    }

    onStartChange = (data) => {
        this.setState({starts: [data[0] - 1, data[1] + 1]})
    }

    genQuery() {
        
        let query = ""

        if (this.state.league !== "Any")
            query +=  "division="+ this.state.league + ","

        if (this.state.position !== 'Any')
            query += "position=" + this.state.position + ","


            query += "goals>" + this.state.goals[0] + ",goals<" + this.state.goals[1] + ",assists>" + this.state.assists[0] +
            ",assists<" + this.state.assists[1] + ",redCards>" + this.state.redCards[0] + ",redCards<" + this.state.redCards[1] + 
            ",yellowCards>" + this.state.yellowCards[0] + ",yellowCards<" + this.state.yellowCards[1] + ",minsPlayed>" + this.state.minsPlayed[0] +
            ",minsPlayed<" + this.state.minsPlayed[1] + ",starts>" + this.state.starts[0] + ",starts<" + this.state.starts[1]        

        return query
    }


    render() {

        let positions = [
            { value: 'FW' },
            { value: 'DF' },
            { value: 'MF' },
            { value: 'Any'}
        ]

        let leagues = [
            {value: 'Championship'},
            {value: 'PremierLeague'},
            {value: 'Bundesliga'},
            {value: 'SerieA'},
            {value: 'Any'}
        ]

        return (
            <ScrollView style={deckStyle.container}>
                <View style={Styles.titleBanner}>
                    <Text style={Styles.titleText}>Search for Cards</Text>
                </View>
                <View style={deckStyle.form}>
                    <Dropdown label="Position" data={positions} onChangeText={this.onPositionChange} />
                    <Dropdown label="League" onChangeText={this.onLeagueChange} data={leagues} />
                    <View style={deckStyle.sliderContaner}>
                        <Text style={deckStyle.formFont}>Goals</Text>
                        <MultiSlider min={0} max={40} values={[0, 40]} sliderLength={280} 
                        enableLabel={true} onValuesChange={this.onGoalsChange}/>
                    </View>
                    <View style={deckStyle.sliderContaner}>
                        <Text style={deckStyle.formFont}>Assists</Text>
                        <MultiSlider min={0} max={40} values={[0, 40]} sliderLength={280} 
                        enableLabel={true} onValuesChange={this.onAssistsChange} />
                    </View>
                    <View style={deckStyle.sliderContaner}>
                        <Text style={deckStyle.formFont}>Red Cards</Text>
                        <MultiSlider min={0} max={40} values={[0, 40]} sliderLength={280} 
                        enableLabel={true} onValuesChange={this.onRedCardChange} />
                    </View>
                    <View style={deckStyle.sliderContaner}>
                        <Text style={deckStyle.formFont}>Yellow Cards</Text>
                        <MultiSlider min={0} max={40} values={[0, 40]} sliderLength={280} 
                        enableLabel={true}  onValuesChange={this.onYellowCardChange}/>
                    </View>
                    <View style={deckStyle.sliderContaner}>
                        <Text style={deckStyle.formFont}>Starts</Text>
                        <MultiSlider min={0} max={40} values={[0, 40]} sliderLength={280} 
                        enableLabel={true} onValuesChange={this.onStartChange} />
                    </View>
                    <View style={deckStyle.sliderContaner}>
                        <Text style={deckStyle.formFont}>Minutes Played</Text>
                        <MultiSlider min={0} max={40} values={[0, 40]} sliderLength={280} 
                        enableLabel={true} onValuesChange={this.onMinsChange} />
                    </View>
                </View>
                <View style={deckStyle.centre}>
                    <TouchableOpacity style={[Styles.buttonTemplate, deckStyle.submitButton]} 
                    onPress={() => this.props.navigation.navigate('Results',
                                                                {query: this.genQuery(), addSelectedCard: this.addSelectedCard, 
                                                                deleteSelectedCard: this.deleteSelectedCard, selectedCards: this.state.selectedCards})}>

                        {<Text style={Styles.buttonText}>Submi{/*  */}t</Text>}
                    </TouchableOpacity>
                    {this.selectedCardsMsg()}
                </View>
            </ScrollView>
        );
    }

}

const ENDPOINT = "http://81.154.167.160:8080/api/v1/players/"

class Results extends React.Component {

    constructor(props) {
        super(props)

        console.log(this.props)

        this.state = {
            players: [],
            query: this.props.route.params.query,
            addSelectedCard: this.props.route.params.addSelectedCard,
            deleteSelectedCard: this.props.route.params.deleteSelectedCard,
            selectedCards: this.props.route.params.selectedCards
        }

        console.log(this.state.addSelectedCard)

    }

    genProfiles = () => {

        axios.get(ENDPOINT + "search?query=" + this.state.query)
            .then(response => {
                this.setState({players: response.data})
            })
    }

    
    componentDidMount = () => {
        this.genProfiles()
    }

    componentWillUnmount = () => {
        this.setState({players: []})
        this.setState({query: ""})
    }
    
    addProfileWidgets = () => {
        let playerProfiles = []
        for (let player of this.state.players) {
            playerProfiles.push(<PlayerWidget player={player} addSelectedCard={this.state.addSelectedCard} 
                                                                deleteSelectedCard={this.state.deleteSelectedCard}
                                                                selectedCards= {this.state.selectedCards} />)
        }

        return (
            <View>
                {playerProfiles}
            </View>
        )
    }

    render() {

        
        return (
            <ScrollView>
                {this.addProfileWidgets()}
            </ScrollView>
        )
    }
}

class PlayerWidget extends React.Component {

    constructor() {
        super()
        this.state = {
            highlighted: false
        }
    }

    componentDidMount = () => {
        this.setHighlighted()
    }

    select = () => {

        if (this.state.highlighted) 
            this.props.deleteSelectedCard(this.props.player.id)
        else
            this.props.addSelectedCard(this.props.player.id)

        this.setState({highlighted: !this.state.highlighted})
    }

    setHighlighted = () => {
        if (this.props.selectedCards.findIndex((element) => element === this.props.player.id) > -1)
            this.setState({highlighted: true})
        else
            this.setState({highlighted: false})
    }

    render() {
        let text = " Name: " + this.props.player.name + "\n Goals: " + this.props.player.goals
                    + "\n Assists: " + this.props.player.assists + "\n Starts: " + this.props.player.starts

        return (
            <TouchableOpacity style={[playerWidgetStyle.container, this.state.highlighted ? 
            playerWidgetStyle.highlighted : playerWidgetStyle.notHighlighted]} onPress={this.select}>

            <Image style={{width:100, height:100}} source={{uri: this.props.player.imageURL}} />
            <View>
                    <Text>{text}</Text>
            </View>
            </TouchableOpacity>
        );
    }
}

const playerWidgetStyle = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        flexDirection: 'row'   
    },
    highlighted: {
        backgroundColor: colourPalette.red
    },
    notHighlighted: {
        backgroundColor: "white"
    }
})


const deckStyle = StyleSheet.create({
    newDeckButton: {
        height: '20%',
        width: '80%',
        backgroundColor: colourPalette.blue
    },
    viewDeckButton: {
        height: '20%',
        width: '80%',
        backgroundColor: colourPalette.green,
    },
    container: {
        flex: 1,
    },
    form: {
        flex: 20,
        margin: 10
    },
    formFont: {
        fontSize: 20,
        margin: 30
    },
    sliderContaner: {
        alignItems: 'center',
    },
    submitButton: {
        width: 200,
        backgroundColor: colourPalette.green
    },
    centre: {
        justifyContent: 'center',
        alignItems: 'center',
        height: 200
    }
})

export {Deck, NewDeck, Results}