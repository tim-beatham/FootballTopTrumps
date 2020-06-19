# FootballTopTrumps

For a more in depth explanation please visit: https://tim-beatham.github.io/Week5/Week5.html

I implemented top trumps using a Spring Boot backend and a React-Native front end. Top Trumps is a british card game. 2 or more players take turn to choose an attribute that trumps all other attributes in other peoples cards. The person with the highest attribute takes all the card for that round. The last person standing is the winner.

## The Back End

I used Spring Boot and MongoDB to develop the backend of the application. I choose to use MongoDB as it is a NoSQL database store. This means I am not limited to a rigid schema. This allows my cards to potentially have special attributes and it also means that newer cards are compatible with older cards.

Below are the PoJo designs for the backend:

![pojos for the backend](https://tim-beatham.github.io/Week5/Football_PoJos.png)

I developed a REST API so the front end can query player cards, query decks and add decks to the MongoDB database.

## The Front End


